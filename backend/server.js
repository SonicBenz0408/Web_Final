import WebSocket from "ws"
import http from "http"
import express from "express"
import mongoose, { models } from "mongoose" 
import dotenv from "dotenv-defaults"
import { sendData, sendStatus, initData, favorData } from "./wssConnect"
import User from "./models/User"
import bcrypt from "bcrypt"
import crawl from "./crawler/crawler"
import nameId from "./crawler/nameId.json"
import { ConsoleMessage } from "puppeteer"
import Vtuber from "./models/Vtuber"
import Stream from "./models/Stream"
import Upcoming from "./models/Upcoming"
const { performance } = require('perf_hooks')

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

const init_vtuber = async () => {
    for (var key in nameId) {
        for (var keykey in nameId[key]){
            if (nameId[key].hasOwnProperty(keykey) && key === 'Hololive') {
                // let output = await crawl(key, keykey);
                // console.log(output);
                const check = await Vtuber.find({name: keykey});
                if(check.length !== 0){
                    console.log(`${keykey} exists`);
                }
                else{
                    const vtuber = new Vtuber({ 
                        name: keykey, 
                        id: nameId[key][keykey], 
                        corp: key, 
                        channel : 'https://www.youtube.com/channel/' + nameId[key][keykey]
                    });
                    await vtuber.save();
                }
            }
        }
    }
};

const crawl_str_ups = async() => {
    await Stream.deleteMany({});
    await Upcoming.deleteMany({});
    for (var corp in nameId){
        for(var key in nameId[corp]){
            if(nameId[corp].hasOwnProperty(key)){
                let output = await crawl(corp, key);
                for(let i = 0; i < output[0].length; i++){
                    let stream = new Stream({
                        corp: corp, 
                        img: output[0][i].img, 
                        url: output[0][i].addr,
                        title: output[0][i].title,
                        id: nameId[corp][key]});
                    await stream.save();
                }
                for(let i = 0; i < output[1].length; i++){
                    let upcoming = new Upcoming({
                        corp: corp, 
                        img: output[1][i].img, 
                        url: output[1][i].addr,
                        title: output[1][i].title,
                        id: nameId[corp][key],
                        time: output[1][i].time
                    });
                    await upcoming.save();
                }
            }
            console.log(`finish ${key}`);
        }
        console.log(`Done ${corp}`);
    }
}

db.once("open", async () => {
    console.log("MongoDB connected")
    //crawl_str_ups();
    // const output = await crawl("彩虹社", "叶")
    // console.log(output)
    // var start = performance.now();
    // crawl_str_ups();
    // var end = performance.now();
    // console.log(`Call to doSomething took ${end - start} milliseconds`)
    setInterval(crawl_str_ups, 1800000);

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
                        user.favor.push(id);
                        user.save();
                        console.log("here subscribe: ", user)
                    }
                    break
                }
                case "unsubscribe": {
                    const { username, id } = payload[0]
                    let  user = await User.findOne({username})
                    if( !user.favor.includes(id) ){
                        const index = user.favor.indexOf(id);
                        if (index > -1) {
                            user.favor.splice(index, 1);
                        }
                        user.favor.save();
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