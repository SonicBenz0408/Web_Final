import mongoose from "mongoose"

const Schema = mongoose.Schema
const StreamSchema = new Schema({
    corp: {
        type: String,
        required: [true, "Corp field is required."]
    },
    img: {
        type: String,
        required: [true, "Img field is required."]
    },
    url: {
        type: String,
        required: [true, "Url field is required."]
    },
    title: {
        type: String,
        required: [true, "Title field is required."]
    },
    id: {
        type: String,
        required: [true, "Id field is required."]
    }

})

const Stream = mongoose.model("Stream", StreamSchema)

export default Stream