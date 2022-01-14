import WebSocket from "ws"
//import http from "http"
import https from "https"
import fs from "fs"
import express from "express"
import mongoose from "mongoose" 
import dotenv from "dotenv-defaults"

import { sendData, sendStatus, initData, iconData } from "./wssConnect.js"

import User from "./models/User.js"
import bcrypt from "bcrypt"
import { crawl, crawlIcon } from "./crawler/crawler.js"
import nameId from "./crawler/nameId.json"
import Vtuber from "./models/Vtuber.js"
import Stream from "./models/Stream.js"
import Upcoming from "./models/Upcoming.js"
import Icon from "./models/Icon.js"
import wakeUpDyno from "./routes/wakeUpDyno.js"

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

//const server = http.createServer(app)

const server = https.createServer({
    key: fs.readFileSync("../server-key.pem"),
    cert: fs.readFileSync('../server-cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
}, app)

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

const broadcastIcon = (icon) => {
    console.log("boardcastIcon!!");
    wss.clients.forEach(async (client) => {
        sendData(["icon", [{ icon }]], client);
    })
}

const broadcastStream = (upstream) => {
    console.log("boardcast!!");
    wss.clients.forEach(async (client) => {
        sendData(["upstream", [{upstream}]], client);
    })
}

const to_number = (str) => {
    // 2022/1/13 晚上20:00
    // let str = "2023/1/1 凌晨0:00"
    str = str.split(" ")
    let date = str[0].split("/");
    if (date.length < 3)
        return 0;
    if (date[1].length < 2) date[1] = '0' + date[1];
    if (date[2].length < 2) date[2] = '0' + date[2];
    let len = str[1].length;
    let hm = str[1].substring(2, len).split(":");
    if (hm[0].length < 2) hm[0] = '0' + hm[0];
    if (hm[1].length < 2) hm[1] = '0' + hm[1];
    return (parseInt(date[0]+date[1]+date[2]+hm[0]+hm[1]));
}

const init_vtuber = async () => {
    for (var key in nameId) {
        if(key === 'Hololive') continue;
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

const crawlAllIcon = async () => {
    let allIcon = []
    for (var corp in nameId){
        // if (corp === '彩虹社') continue;
        for(var key in nameId[corp]){
            console.log(key);
            let output = await crawlIcon(corp, key)
            allIcon.push(output)
        }
    }

    await Icon.deleteMany({})

    for(let i = 0; i < allIcon.length; i++){
        let icon = new Icon(allIcon[i])
        await icon.save()
    }

    // broadcastIcon(allIcon)
}

const crawl_str_ups = async() => {
    let upstream_data = {};
    let output_stream = [];
    let output_up = [];
    for (var corp in nameId){
        for(var key in nameId[corp]){
            upstream_data[key] = {live: [], upcoming: []};
            if(nameId[corp].hasOwnProperty(key)){
                let output = await crawl(corp, key);
                for(let i = 0; i < output[0].length; i++){
                    let tmp_stream = {
                        corp: corp, 
                        img: output[0][i].img, 
                        url: output[0][i].addr,
                        title: output[0][i].title,
                        id: nameId[corp][key]
                    };
                    output_stream.push(tmp_stream);
                    upstream_data[key].live.push(tmp_stream);
                }
                for(let i = 0; i < output[1].length; i++){
                    let tmp_up = {
                        corp: corp, 
                        img: output[1][i].img, 
                        url: output[1][i].addr,
                        title: output[1][i].title,
                        id: nameId[corp][key],
                        time: output[1][i].time,
                        timetonum: output[1][i].timetonum
                    };
                    // console.log(to_number(output[1][i].time))
                    output_up.push(tmp_up);
                    upstream_data[key].upcoming.push(tmp_up)
                }
                if(upstream_data[key].upcoming.length === 0 && upstream_data[key].live.length === 0)
                    delete upstream_data[key];
            }
            console.log(`finish ${key}`);
        }
        console.log(`Done ${corp}`);
    }
    // console.log(upstream_data);
    broadcastStream(upstream_data);
    await Stream.deleteMany({});
    await Upcoming.deleteMany({});
    for(let i = 0; i < output_stream.length; i++){
        let stream = new Stream(output_stream[i]);
        await stream.save();
    }

    for(let i = 0; i < output_up.length; i++){
        let upstream = new Upcoming(output_up[i]);
        await upstream.save();
    }

}

db.once("open", async () => {
    console.log("MongoDB connected")

    // If db already has the data of icon -> comment
    //crawlAllIcon();  
    
    crawl_str_ups();
    setInterval(crawl_str_ups, 1800000);

    wss.on("connection", (ws) => {
        ws.onmessage = async (byteString) => {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            console.log("task: " + task)
            console.log(payload)
            switch (task) {
                //  to initialize homepage
                case "upstream": {
                    initData(ws)
                    break
                }
                // frontend: sendData(['favor', [{username}]])
                case "favor": {
                    
                    const {username} = payload[0]
                    const user = await User.findOne({ username });
                    const favor = user.favor;
                    // console.log(favor);
                    sendData(["favor", [{favor: favor}]], ws);
                    break;
                }
                case "icon": {
                    iconData(ws)
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
                        const check = await bcrypt.compare(password, userHash[0].hash)
                        if(check){
                            sendData([ "login", [{ msg: "Login successfully!", status: "success", loginUser: username }]], ws)
                            console.log(`${username} logs in!`)
                        }
                        else{
                            sendData([ "login", [{ msg: "Wrong password!", status: "failed"}]], ws)
                            console.log(`${username}: wrong password!`)
                        }
                    }
                    break
                }

                case "revise": {
                    const { username, oldpassword, newpassword } = payload[0]
                    const userHash = await User.find({username: username})
                    
                    const check = await bcrypt.compare(oldpassword, userHash[0].hash)
                    if(check){
                        const newHash = await bcrypt.hash(newpassword, saltRounds)
                        await User.updateOne({username: username}, {$set: {hash: newHash}})

                        sendData([ "revise", [{ msg: "Revise successfully!", status: "success" }]], ws)
                        console.log(`${username} revises password!`)
                    }
                    else{
                        sendData([ "revise", [{ msg: "Wrong password!", status: "unmatch"}]], ws)
                        console.log(`${username}: wrong password!`)
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
                // frontend: sendData(['subscribe', [{ username, favor: ["沙花叉クロヱ", "宝鐘マリン"]}]]);
                case "subscribe": {
                    const { username, favor } = payload[0]
                    await User.findOne({username})
                    .exec( async (err, res) => {
                        if (err) throw err;
                        res.favor = favor;
                        await res.save();
                    });
                    break;
                }
                default: break
            }
        }
    })
    
    const PORT = process.env.PORT || 4000

    server.listen(PORT, () => {
        const DYNO_URL = "https://vtdd.herokuapp.com/"
        wakeUpDyno(DYNO_URL)
        console.log(`Listening on http://localhost:${PORT}`)
    })
})

