import Upcoming from "./models/Upcoming.js"
import Stream from "./models/Stream.js"
import nameId from "./crawler/nameId.json"
import Icon from "./models/Icon.js"

const sendData = (data, ws) => {
    ws.send(JSON.stringify(data))
}

const sendStatus = (payload, ws) => {
    sendData(["status", payload], ws)
}

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  }
  

const initData = async (ws) => {
    var upstream = {};
    await Stream.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
                .exec((err, res) => {
                    if(err) throw err;
                    // upstream[keykey].live = res;
                    for (let i = 0; i < res.length; i++){
                        let key = getKeyByValue(nameId[res[i].corp], res[i].id);
                        upstream[key] = {live:[], upcoming:[]};
                        upstream[key].live = [...upstream[key].live, [res[i]]];
                    }
                })
    await Upcoming.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err;
            // console.log("hi")
            for (let i = 0; i < res.length; i++){
                let key = getKeyByValue(nameId[res[i].corp], res[i].id);
                if(!upstream[key])
                    upstream[key] = {live:[], upcoming:[]};
                upstream[key].upcoming = [...upstream[key].upcoming, [res[i]]];
                if(i === res.length - 1){
                    // console.log(upstream);
                    sendData(["upstream", [{upstream}]], ws);
                }
            }
        })

}

const iconData = async (ws) => {

    var allData = { "Hololive": [], "彩虹社": [], "其他": [] }

    await Icon.find({'corp': "Hololive"}, "-_id -__v").exec((err, res) => {
        if(err) throw err
        for(let i=0 ; i < res.length ; i++){
            let name = {}
            name[res[i]["name"]] = [res[i]["icon"], res[i]["url"], res[i]["corp"]]
            allData["Hololive"].push(name)
        }
    })

    await Icon.find({'corp': "彩虹社"}, "-_id -__v").exec((err, res) => {
        if(err) throw err
        for(let i=0 ; i < res.length ; i++){
            let name = {}
            name[res[i]["name"]] = [res[i]["icon"], res[i]["url"], res[i]["corp"]]
            allData["彩虹社"].push(name)
        }
    })

    await Icon.find({'corp': "其他"}, "-_id -__v").exec((err, res) => {
        if(err) throw err
        for(let i=0 ; i < res.length ; i++){
            let name = {}
            name[res[i]["name"]] = [res[i]["icon"], res[i]["url"], res[i]["corp"]]
            allData["其他"].push(name)

            if(i === res.length - 1){
                // console.log(upstream);
                sendData(["icon", [{ allData }]], ws)
            }
        }
    })

}

export { sendData, sendStatus, initData, iconData }
