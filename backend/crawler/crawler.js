const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const vtInfo = require("./nameId.json") 

const ytPrefix = "https://youtube.com/"
const liveSuffix = "/videos?view=2&live_view=501"
const tempSuffix = "/videos?view=2&live_view=502"

const parse = (html, type) => {
    const $ = cheerio.load(html)
    let results = []
    const data = $("#contents ytd-grid-video-renderer")
    
    if (data.length > 10){
        return results
    }

    if (type == "live"){
        data.each((i, link) => {
            var addr = ytPrefix + $(link).find("#thumbnail").attr("href")
            var img = $(link).find("#img").attr("src")
            var title = $(link).find("#video-title").attr("title")
            results.push({addr: addr, img: img, title: title})
        })
    }
    else{
        data.each((i, link) => {
            var addr = ytPrefix + $(link).find("#thumbnail").attr("href")
            var img = $(link).find("#img").attr("src")
            var title = $(link).find("#video-title").attr("title")
            var time = $(link).find("#metadata-line span")[1].children[0].data.substring(7)
            results.push({addr: addr, img: img, title: title, time: time})
        })
    }
    
    //console.log(results)
    return results
}

const crawl = async (corps, name) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true
    })
    const page = await browser.newPage()
    var url = ytPrefix + "channel/" + vtInfo[corps][name] + liveSuffix
    await page.goto(url, {timeout:0})
    var html = await page.content()
    const liveResults = parse(html, "live")

    url = ytPrefix + "channel/" + vtInfo[corps][name] + tempSuffix
    await page.goto(url)
    html = await page.content()
    const tempResults = parse(html, "temp")
    
    await browser.close()
    
    return [liveResults, tempResults]
}

export default crawl
