const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    wallet: String,
    char: String,
    word: String
})

const User = mongoose.model("User", userSchema)
module.exports = User