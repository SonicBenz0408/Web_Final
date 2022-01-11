import mongoose from "mongoose"

const Schema = mongoose.Schema
const IconSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required."]
    },
    corp: {
        type: String,
        required: [true, "Corp field is required."]
    },
    icon: {
        type: String,
        required: [true, "icon field is required."]
    },
    url: {
        type: String,
        required: [true, "url field is required."]
    }
})

const Icon = mongoose.model("Icon", IconSchema)

export default Icon