const express = require("express")
const path = require("path")
const MongoClient = require("mongodb").MongoClient
const bodyParser = require("body-parser")

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/get-profile", async (req, res) => {
  try {
    const client = await MongoClient.connect(
      "mongodb://admin:password@localhost:27017",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    const db = client.db("user-account")
    const query = { userId: 1 }
    const result = await db.collection("users").findOne(query)
    client.close()

    res.send(result)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send("Error fetching profile")
  }
})

app.post("/update-profile", async (req, res) => {
  const userObj = req.body

  console.log(userObj)
  console.log("Connecting to the database")

  try {
    const client = await MongoClient.connect(
      "mongodb://admin:password@127.0.0.1:27017",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log("Successfully connected to the user-account db")

    const db = client.db("user-account")
    const query = { userId: 1 }
    const newValue = { $set: userObj }

    const result = await db
      .collection("users")
      .updateOne(query, newValue, { upsert: true })

    console.log("Successfully inserted/updated")
    client.close()
    res.send(userObj)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send("Error updating the document")
  }
})

app.listen(3000, function () {
  console.log("app listening on port 3000")
})
