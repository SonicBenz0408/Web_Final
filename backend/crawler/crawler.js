import puppeteer from "puppeteer"
import cheerio from "cheerio"
import vtInfo  from "./nameId.json" 

const ytPrefix = "https://youtube.com/"
const liveSuffix = "/videos?view=2&live_view=501"
const tempSuffix = "/videos?view=2&live_view=502"
const bigMonth = ["1", "3", "5", "7", "8", "10", "12"]

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
                time_link[1].children[0].data.substring(14):
                time_link[0].children[0].data.substring(14)
            
            // 1/13/22, 8:00 PM
            let part = time.split(" ") // [ "1/13/22," , "8:00", "PM"]
            let date = part[0].substring(0, part[0].length-1).split("/") // ["1", "13", "22"]
            let hm = part[1].split(":")
            if(part[2] === "PM") hm[0] = parseInt(hm[0]) + 20
            else hm[0] = parseInt(hm[0]) + 8
            if (hm[0] >= 24){
                hm[0] = hm[0] - 24
                date[1] = parseInt(date[1]) + 1
                if(bigMonth.find(date[0]) && date[1] > 31){
                    date[0] = parseInt(date[0]) + 1
                    date[1] = date[1] - 31
                }
                else if(date[0] === "2" && date[1] > 28){
                    date[0] = parseInt(date[0]) + 1
                    date[1] = date[1] - 28
                
                }
                else if(date[1] > 30){
                    date[0] = parseInt(date[0]) + 1
                    date[1] = date[1] - 30
                }

                date[0] = String(date[0])
                date[1] = String(date[1])
                if(date[0] === "13"){
                    date[2] = String(parseInt(date[2]) + 1)
                    date[0] = "1"
                }
            }
            
            if (date[0].length < 2) date[0] = '0' + date[1];
            if (date[1].length < 2) date[1] = '0' + date[2];
            if (hm[0].length < 2) hm[0] = '0' + hm[0];
            if (hm[1].length < 2) hm[1] = '0' + hm[1];

            time = `20${date[2]}/${date[0]}/${date[1]} ${hm[0]}:${hm[1]}`
            var timetonum = parseInt(`${date[2]}${date[0]}${date[1]}${hm[0]}${hm[1]}`)
            results.push({addr: addr, img: img, title: title, time: time, timetonum: timetonum})
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
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
