const mongoose = require("mongoose")

const wordSchema = mongoose.Schema({
    word: String,
    taken: [Boolean]
})

const Word = mongoose.model("Word", wordSchema)
module.exports = Word