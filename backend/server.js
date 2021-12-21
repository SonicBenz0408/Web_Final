import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv-defaults"
import vtRouter from "./routes/router.js"
import bodyParser from "body-parser"
import crawl from "./crawler/crawler.js"
//import crawl from "./crawler/crawler.js"
// Mongoose DB
dotenv.config()

if(!process.env.MONGO_URL){
    console.error("Missing MONGO_URL !")
    process.exit(1)
}
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
const app = express()
// init middleware
app.use(cors())
app.use(bodyParser.json())
// define routes
app.use("/api", vtRouter)

//db.on("error", (err) => console.log(err))
db.once("open", async () => {
    console.log("MongoDB connected successfully!")
    
    //var info = await crawl("Mori Calliope")
    //console.log(info)
    // define server
    const port = process.env.PORT || 4000
    app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
    })
})


