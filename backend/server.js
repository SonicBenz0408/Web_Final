import WebSocket from "ws"
import http from "http"
import express from "express"
import mongoose, { models } from "mongoose" 
import dotenv from "dotenv-defaults"
import { sendData, sendStatus, initData, favorData } from "./wssConnect"
import User from "./models/User"
import bcrypt from "bcrypt"
dotenv.config()

if(!process.env.MONGO_URL){
    console.error("Missing MONGO_URL !")
    process.exit(1)
}
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const saltRounds = 10

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const db = mongoose.connection

const broadcastMessage = (data, status) => {
    wss.clients.forEach(async (client) => {
        console.log("data", data)
        console.log("status", status)
        sendData(data, client)
        sendStatus(status, client)
    })
}

db.once("open", () => {
    console.log("MongoDB connected")
    wss.on("connection", (ws) => {
        ws.onmessage = async (byteString) => {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            console.log(task, payload)
            switch (task) {
                case "init": {
                    initData(ws)
                    break
                }
                case "favor": {
                    const {username} = payload[0]
                    const user = await User.findOne({ username })
                    favorData(ws, user.favor)
                    break
                }
                case "login": {
                    const { username, password } = payload[0]
                    const userHash = await User.find({username: username})
                    if(userHash.length === 0){
                        sendData([ "login", [{ msg: "The username doesn't exist." , status: "not exist" }]], ws)
                        console.log("Username doesn't exist")
                    }
                    else{
                        console.log(userHash)
                        const check = await bcrypt.compare(password, userHash[0].hash)
                        if(check){
                            sendData([ "login", [{ msg: "Login successfully!", status: "success"}]], ws)
                            console.log(`${username} logs in!`)
                        }
                        else{
                            sendData([ "login", [{ msg: "Wrong password!", status: "failed"}]], ws)
                            console.log(`${username}: wrong password!`)
                        }
                    }
                    break
                }
                case "regist": {
                    const { username, password } = payload[0]
                    const check = await User.find({username: username})
                    
                    if(check.length !== 0){
                        sendData([ "regist", [{ msg: "The username has already existed." , status: "exist" }]], ws)
                        console.log("Username has already existed")
                    }
                    else{
                        try{
                            const hash = await bcrypt.hash(password, saltRounds)
                            const favor = []
                            const userInfo = new User({ username, hash, favor })
                            await userInfo.save()
                            sendData([ "regist", [{ msg: `Done! Please login again!` , status: "success"}]], ws)
                            console.log("Done!")
                        }
                        catch(e){
                            sendData([ "regist", [{ msg: "DB save error!", status: "error"}]], ws)
                            console.log("Error!" + e)
                        }
                    }
                    break
                }
                // subscribe channel
                case "subscribe": {
                    const { username, id } = payload[0]
                    let  user = await User.findOne({username})
                    if( !user.favor.includes(id) ){
                        const new_favor = [...user.favor, id]
                        user = await User.findOneAndUpdate({username}, {favor: new_favor},{
                            new: true
                        })
                        console.log("subscribe: ", user)
                    }
                    break
                }
                default: break
            }
        }
    })
    
    const PORT = process.env.port || 4000

    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
})