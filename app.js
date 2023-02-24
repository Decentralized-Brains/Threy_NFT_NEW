const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const User = require("./userModel")
const Word = require("./wordModel")

const MONGO_URI = "mongodb+srv://testApp:sr0d1GR4SmKPXJvZ@cluster0.x9a7koe.mongodb.net/testNft?retryWrites=true&w=majority"
const PORT = 8080

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))


app.get("/get-words", async (req, res) => {
  try {
    const words = await Word.find()
    res.status(200).json(words)
  } catch (err) {
    console.log(err)
    res.status(500).json([])
  }
})

app.post("/get-data", async (req, res) => {
  try {
    const user = await User.findOne({ wallet: req.body.wallet })
    if (!user) return res.status(404).json({data:"Not Found"})
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
})

app.post("/get-selected-words", async (req, res) => {
  const { word } = req.body
  const words = await User.find({ word })
  if (words) return res.json(words)
})

app.post("/get-word-count", async (req, res) => {
  const { wallet, char, word } = req.body
  try {
    const count = await User.countDocuments({ word: req.body.word })
    res.status(200).json({ count })
  } catch (err) {
    console.log(err)
    res.status(500).json({})
  }
})

app.post("/set-data", async (req, res) => {
  try {
    const { wallet, char, word, claimedIdx } = req.body
    // console.log(req.body)
    if (!wallet) return res.status(500).json({})
    let user = await User.findOne({ wallet })
    if (!user) user = new User({ wallet })

    if (char && !user.char) user.char = char
    if (word) {
      console.log(user)
      if (user.word) {
        let wrd1 = await Word.findOne({ word: user.word })
        wrd1.taken[user.claimedIdx] = false
        await wrd1.save()
      }
      // const totalWordCount = await User.countDocuments({ word })
      // if (totalWordCount == word.length) return res.status(500).json({ message: "This word is full! Try another" })
      user.word = word
      user.claimedIdx = claimedIdx
      let wrd = await Word.findOne({ word })
      wrd.taken[claimedIdx] = true
      await wrd.save()
    }
    await user.save()

    res.status(200).json(user)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({})
  }
})

mongoose.set('strictQuery', true);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch(err => console.log(err))

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))