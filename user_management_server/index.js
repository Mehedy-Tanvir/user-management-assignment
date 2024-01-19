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
  // Send a ping to confirm a successful connection
  try {
    // Get the database and collection on which to run the operation

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

    app.get("/brands/:name", async (req, res) => {
      const brand = req.params.name;
      const query = { brand };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
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
