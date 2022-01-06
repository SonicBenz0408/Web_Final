import mongoose from "mongoose"

const Schema = mongoose.Schema
const VtuberSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required."]
    },
    id: {
        type: String,
        required: [true, "Id field is required."]
    },
    channel: {
        type: String,
        required: [true, "channel field is required."]
    },
    corp: {
        type: String,
        required: [true, "channel field is required."]

    }
})

const Vtuber = mongoose.model("Vtuber", VtuberSchema)

export default Vtuber