import mongoose from "mongoose"

const Schema = mongoose.Schema
const UpcomingSchema = new Schema({
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

    time: {
        type: String,
        required: [true, "Time field is required"]
    },

    id: {
        type: String,
        required: [true, "Id field is required."]
    },

    timetonum: {
        type: Number,
        required: [true, "timetonum field is required"]
    }

})

const Upcoming = mongoose.model("Upcoming", UpcomingSchema)

export default Upcoming