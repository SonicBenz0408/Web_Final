import puppeteer from "puppeteer"
import cheerio from "cheerio"
import vtInfo  from "./nameId.json" 

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
            var time_link = $(link).find("#metadata-line span")
            var time = time_link[1] ? 
                time_link[1].children[0].data.substring(7):
                time_link[0].children[0].data.substring(7)
            console.log(time)
            results.push({addr: addr, img: img, title: title, time: time})
        })
    }
    
    //console.log(results)
    return results
}

const parseIcon = (html) => {
    const $ = cheerio.load(html)

    const data = $("#avatar img")
    const result = $(data[0]).attr("src")

    return result
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
    // console.log(url)
    await page.goto(url)
    html = await page.content()
    console.log(name)
    const tempResults = parse(html, "temp")
    
    await browser.close()
    
    return [liveResults, tempResults]
}

const crawlIcon = async (corps, name) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true
    })
    const page = await browser.newPage()
    var url = ytPrefix + "channel/" + vtInfo[corps][name] + liveSuffix
    await page.goto(url, {timeout:0})
    var html = await page.content()
    const img = parseIcon(html)
    console.log("finish " + name)
    const output = { 
        "name": name,
        "corp": corps,
        "icon": img, 
        "url": url
    }
    console.log(output)
    return output
}

export { crawl, crawlIcon }
