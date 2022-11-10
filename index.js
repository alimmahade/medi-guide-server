const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
// const { query } = require("express");
require("colors");
const app = express();
const port = process.env.PORT || 5000;
// must ensure middlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vavtsh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    console.log("database connected".yellow.italic);
    const myCollection = client
      .db("as-11-db-name")
      .collection("collection-n-as-11");
    // app.post("/addservice", async (req, res) => {
    //   const service = req.body;
    //   // console.log(req.body);
    //   const result = await myCollection.insertOne(service);
    //   console.log(result);
    //   res.send(result);
    // });

    // limit data loaded
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = myCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    // All service Data loaded
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = myCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // one spacific service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await myCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
}
run();
app.listen(5000, () => console.log("server is up and running".cyan.bold));
