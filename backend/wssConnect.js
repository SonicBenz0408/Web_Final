import User from "./models/User"
import Vtuber from "./models/Vtuber"
import Upcoming from "./models/Upcoming"
import Stream from "./models/Stream"

const sendData = (data, ws) => {
    ws.send(JSON.stringify(data))
}

const sendStatus = (payload, ws) => {
    sendData(["status", payload], ws)
}

const initData = async (ws) => {
    var init_data = {
        stream: [],
        upstream: []
    }
    await Stream.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            init_data.stream = res
            // sendData(["init", res], ws)
        })
    await Upcoming.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            init_data.upstream = res
            // console.log("init_data",init_data)
            sendData(["init", init_data], ws)
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
            sendData(["favor", favor_data], ws)
        })

}

export { sendData, sendStatus, initData, favorData }