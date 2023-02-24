const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    wallet: String,
    char: String,
    word: String,
    claimedIdx: Number
})

const User = mongoose.model("User", userSchema)
module.exports = User