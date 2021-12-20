import mongoose from "mongoose"

const Schema = mongoose.Schema
const VtuberSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required."]
    },
    score: {
        type: Number,
        required: [true, "Score field is required."]
    }
})

const Vtuber = mongoose.model("Vtuber", VtuberSchema)

export default Vtuber