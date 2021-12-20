import dotenv from "dotenv-defaults"
import jsonParser from "./parser.js"

dotenv.config()
const token = process.env.YOUTUBE_TOKEN
//console.log(process.env.YOUTUBE_TOKEN)

const fs = require("fs");
const { google } = require("googleapis")
const vtInfo = require("./nameId.json") 

const crawl = async ( name ) => {
    
    google.youtube("v3").search.list({
        key: token,
        part: ["snippet"],
        channelId: vtInfo["name"][name],
        type: "video",
        eventType: "upcoming",
    }).then(async (res) => {
        var videos = res.data
        await fs.writeFile("./crawler/current.json", JSON.stringify(videos), (err) => {if (err) throw err})
    }).catch((err) => {
        console.log(err)
    })
    
    const info = await jsonParser("./current.json")
    const details = []
    
    info.items.forEach(async (video) => {
        google.youtube("v3").videos.list({
            key: token,
            part: ["snippet", "contentDetails"],
            id: video.id.videoId,
        }).then(async (res) => {
            var videos = res.data
            await fs.writeFile("./crawler/current.json", JSON.stringify(videos), (err) => {if (err) throw err})
        }).catch((err) => {
            console.log(err)
        })
        var singleData = await jsonParser("./current.json")
        details.push(singleData.items)
        console.log(singleData)
    })
}

export default crawl