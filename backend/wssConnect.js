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
    Stream.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            init_data.stream = res
            // sendData(["init", res], ws)
        })
    Upcoming.find({}, "-_id -__v").sort({ created_at: -1 }).limit(100)
        .exec((err, res) => {
            if(err) throw err
            init_data.upstream = res
            console.log(init_data)
            sendData(["init", init_data], ws)
        })    
}

export { sendData, sendStatus, initData }