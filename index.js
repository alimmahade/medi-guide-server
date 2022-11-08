// un: as-11-db-username
// pas: 4o1QxMIcvezaGpjc
// DB_USER=as-11-db-username
// DB_PASSWORD=4o1QxMIcvezaGpjc
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { query } = require("express");
require("colors");
const app = express();
const port = process.env.PORT || 5000;
// must ensure middlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vavtsh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri);
app.get("/", (req, res) => {
  res.send("My server is Running");
});
async function run() {
  try {
    await client.connect();
    console.log("database connected".yellow.italic);
    // ----------------------
    const myCollection = client
      .db("as-11-db-name")
      .collection("collection-n-as-11");
    // myCollection.insertOne({ name: "Burgeer" });
    // ----------------------------------
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = myCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await myCollection.findOne(query);
      res.send(service);
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack.yellow);
  }
}
run();
app.listen(5000, () => console.log("server is up and running".cyan.bold));
