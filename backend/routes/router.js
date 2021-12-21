import express from "express"
import bcrypt from "bcrypt"
import Vtuber from "../models/Vtuber"
import User from "../models/User"

const saltRounds = 10

const router = express.Router()

//post: send to client
//get: receive from client

router.post("/login", async (req, res) =>{

    const { username, password } = req.body
    const userHash = await User.find({username: username})
    if(userHash.length === 0){
        res.json({ msg: "The username doesn't exist." , status: "not exist" })
        console.log("Username doesn't exist")
    }
    else{
        console.log(userHash)
        const check = await bcrypt.compare(password, userHash[0].hash)
        if(check){
            res.json({ msg: "Login successfully!", status: "success"})
            console.log(`${username} logs in!`)
        }
        else{
            res.json({ msg: "Wrong password!", status: "failed"})
            console.log(`${username}: wrong password!`)
        }
    }
})

router.post("/register", async (req, res) =>{

    const { username, password } = req.body
    const check = await User.find({username: username})
    console.log(username)
    console.log(password)
    console.log(check)
    if(check.length !== 0){
        res.json({ msg: "The username has already existed." , status: "exist" })
        console.log("Username has already existed")
    }
    else{
        try{
            const hash = await bcrypt.hash(password, saltRounds)
            const userInfo = new User({ username, hash })
            await userInfo.save()
            res.json({ msg: `Done! Please login again!` , status: "success"})
            console.log("Done!")
        }
        catch(e){
            res.json({ msg: "DB save error!", status: "error"})
            console.log("Error!" + e)
        }
        
    }
})

export default router