import mongoose from "mongoose"

const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username field is required."]
    },
    hash: {
        type: String,
        required: [true, "Hash field is required."]
    }
})

const User = mongoose.model("User", UserSchema)

export default User