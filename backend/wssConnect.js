import User from "./models/User"
import Vtuber from "./models/Vtuber"
import Upcoming from "./models/Upcoming"
import Stream from "./models/Stream"
import nameId from "./crawler/nameId.json"

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
            console.log("hi")
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

const favorData = async (ws, filter) => {

    var favor_data = {
        stream: [],
        upstream: []
    }

    if(filter.length === 0){
        sendData(["favor", favor_data], ws)
    }

    await Stream.find({'id': {$in: filter}}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            favorData.stream = res
            // console.log(res)
            // sendData(["init", res], ws)
        })
    await Upcoming.find({'id': {$in: filter}}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            favor_data.upstream = res
            // console.log("favor_data", favor_data)
            sendData(["favor", [{favor_data}]], ws)
        })

}

export { sendData, sendStatus, initData, favorData }