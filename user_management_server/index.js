const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello world");
});
// console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const uri = `${process.env.DATABASE}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const database = client.db(`${process.env.DB_NAME}`);

    const adminsCollection = database.collection("admins");
    const usersCollection = database.collection("users");

    app.post("/admins", async (req, res) => {
      const info = req.body;
      const result = await adminsCollection.findOne({ user_id: info.user_id });

      if (result) {
        if (result.password === info.password) {
          res.send({ success: true, message: "Login successful" });
        } else {
          res
            .status(401)
            .send({ success: false, message: "Incorrect password" });
        }
      } else {
        res.status(404).send({ success: false, message: "User not found" });
      }
    });
    app.post("/createUsers", async (req, res) => {
      const userInfo = req.body;

      try {
        const existingUser = await usersCollection.findOne({
          user_id: userInfo.user_id,
        });

        if (existingUser) {
          res
            .status(409)
            .send({ success: false, message: "User already exists" });
        } else {
          const result = await usersCollection.insertOne({
            user_id: userInfo.user_id,
            password: userInfo.password,
          });

          res.send({ success: true, message: "User created successfully" });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({
          success: false,
          message: "Internal server error. Please try again later.",
        });
      }
    });
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // db ping
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log("db not connecting");
  }
}
run().catch(console.dir);
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});
