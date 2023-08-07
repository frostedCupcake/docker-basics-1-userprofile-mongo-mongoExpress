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

app.get("/get-profile", (req, res) => {
  const response = res
  MongoClient.connect(
    "mongodb://admin:password@localhost:27017",
    (err, client) => {
      if (err) throw err

      console.log("connected to database")
      const db = client.db("user-account")
      const query = { userId: 1 }
      db.collection("users").findOne(query, (err, result) => {
        if (err) throw err
        client.close()
        response.send(result)
      })
    },
  )
})

app.post("/update-profile", (req, res) => {
  const userObj = req.body

  console.log(userObj)
  console.log("Connecting to the database")

  MongoClient.connect(
    "mongodb://admin:password@127.0.0.1:27017",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.error("Error connecting to MongoDB:", err)
        return res.status(500).send("Error connecting to the database")
      }

      console.log("Successfully connected to the user-account db")

      const db = client.db("user-account")
      const query = { userId: 1 }
      const newValue = { $set: userObj }

      db.collection("users").updateOne(
        query,
        newValue,
        { upsert: true },
        (err, result) => {
          if (err) {
            console.error("Error updating the document:", err)
            client.close()
            return res.status(500).send("Error updating the document")
          }

          console.log("Successfully inserted/updated")
          client.close()
          return res.send(userObj)
        },
      )
    },
  )
})

app.listen(3000, function () {
  console.log("app listening on port 3000")
})
