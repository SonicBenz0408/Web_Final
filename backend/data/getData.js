const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const fs = require("fs")

const nijiPrefix = "https://www.nijisanji.jp/en/members"
const nijiPrefix2 = "https://www.nijisanji.jp/members/"
const filter = ["?filter=にじさんじ", "", "?filter=NIJISANJI%20ID", "?filter=NIJISANJI%20KR"]
    
const holoPrefix = "https://hololive.hololivepro.com/talents"

const parseName = (html) => {
    const $ = cheerio.load(html)
    let results = []
    const data = $(".zjh02u-0")
    
    data.each((i, link) => {
        var name = $(link).find(".bt1fbu-0 span")[0].children[0].data.toLowerCase().split(" ")
        results.push(name)
    })
    return results
}
const parseId = async (string, page) => {
    var comb = string.join("-")
    var url = nijiPrefix2 + comb
    await page.goto(url)
    var html = await page.content()
    var $ = cheerio.load(html)
    var data = $(".t5fzsi-1")
    if(data.length === 0){
        comb = string.reverse().join("-")
        url = nijiPrefix2 + comb
        await page.goto(url)
        html = await page.content()
        $ = cheerio.load(html)
        data = $(".t5fzsi-1")
    }
    var name = $(data[0]).find(".sc-1tljxg1-0")[0].children[0].data
    var id = $(data[0]).find(".sc-1l0aooc-0 a")[$(data[0]).find(".sc-1l0aooc-0 a").length - 1].attribs.href.substring(32).slice(0, -19)
    console.log(name + id)
    var result = { "name" : name, "id" : id }
    return result

}

const crawlNiji = async () => {

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })
    const page = await browser.newPage()    
    
    var totalResults = []

    for(let i=0 ; i < filter.length ; i++){
        var url = nijiPrefix + filter[i]
        await page.goto(url)
        var html = await page.content()
        var results = parseName(html)
        for(let j=0 ; j < (results.length) ; j++){
            finalResults = await parseId(results[j], page)
            totalResults.push(finalResults)
        }
    }
    await browser.close()
    
    var output = {
        "彩虹社":{
            
        }
    }
    for(let i=0 ; i < totalResults.length ; i++){
        output.彩虹社[totalResults[i].name] = totalResults[i].id
    }
    fs.writeFile("./niji.json", JSON.stringify(output, null, 2), (err) => {if (err) throw err} )

}


const parseUrl = (html) => {
    const $ = cheerio.load(html)
    let results = []
    const data = $(".talent_list").find("li")
    
    data.each((i, link) => {
        var url = $(link).find("a").attr("href")
        results.push(url)
    })
    return results
}
const parseInfo = (html) => {
    const $ = cheerio.load(html)
    const data = $(".right_box")
    var name = data.find(".bg_box h1")[0].children[0].data.substring(1)
    var id = data.find(".t_sns a")[0].attribs.href.substring(32).slice(0, -19)
    var result = { "name" : name, "id" : id }
    console.log(result)
    return result
}

const crawlHolo = async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    })
    const page = await browser.newPage()    
    
    var totalResults = []

    var url = holoPrefix
    await page.goto(url)
    var html = await page.content()
    var totalUrl = parseUrl(html)
    for(let i=0 ; i < (totalUrl.length) ; i++){
        await page.goto(totalUrl[i])
        html = await page.content()
        finalResults = await parseInfo(html)
        totalResults.push(finalResults)
    }

    await browser.close()
    
    var output = {
        "Hololive":{
            
        }
    }
    for(let i=0 ; i < totalResults.length ; i++){
        output.Hololive[totalResults[i].name] = totalResults[i].id
    }
    fs.writeFile("./holo.json", JSON.stringify(output, null, 2), (err) => {if (err) throw err} )
}
//crawlNiji()
crawlHolo()