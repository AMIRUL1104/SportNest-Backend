const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

// Load environment variables from .env
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // "SportNestdb" নামে database select করা হয়েছে
    const database = client.db("SportNestdb");

    //  "facilities" collection select করা হয়েছে
    const facilitiesCollection = database.collection("facilities");
    const bookingCollection = database.collection("booking");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.get("/destination", async (req, res) => {
//   const result = await destinationCollection.find().toArray();
//   res.json(result);
// });

// app.get("/destination/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log(id);

//   const query = {
//     _id: new ObjectId(id),
//   };

//   const result = await destinationCollection.findOne(query);
//   res.json(result);
// });

// // add a new destination
// app.post("/destination", async (req, res) => {
//   const newDestination = req.body;
//   const result = await destinationCollection.insertOne(newDestination);
//   res.send(result);
// });

// app.patch("/destination/:id", async (req, res) => {
//   const updatedData = req.body;
//   const id = req.params.id;
//   const filter = { _id: new ObjectId(id) };
//   updatedDoc = {
//     $set: updatedData,
//   };
//   const result = await destinationCollection.updateOne(filter, updatedDoc);
//   res.send(result);
// });

// app.delete("/destination/:id", async (req, res) => {
//   const id = req.params.id;

//   const query = {
//     _id: new ObjectId(id),
//   };

//   const result = await destinationCollection.deleteOne(query);

//   res.send(result);
// });
