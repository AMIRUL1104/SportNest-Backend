const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

// Load environment variables from .env
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  }),
);
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

    // ===========================================================
    // ================= Facilities API ===============
    // ===========================================================

    app.get("/facilities", async (req, res) => {
      try {
        const email = req.query.email || "";
        const search = req.query.search || "";
        const type = req.query.type || "";

        const query = {};

        // email filter (manage facility)
        if (email) {
          query.ownerEmail = email;
        }

        // search by facility name
        if (search) {
          query.name = {
            $regex: search,
            $options: "i",
          };
        }

        // facility type filter
        if (type) {
          query.type = type;
        }

        const result = await facilitiesCollection.find(query).toArray();

        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    });

    app.get("/facilities/limited", async (req, res) => {
      try {
        // কোনো কুয়েরি ছাড়াই সরাসরি প্রথম ৬টি ডাটা ফেচ করবে
        const result = await facilitiesCollection.find({}).limit(6).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/facilities/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await facilitiesCollection.findOne(query);

      res.send(result);
    });

    // // add a new facility
    app.post("/facilities", async (req, res) => {
      const newFacility = req.body;
      const result = await facilitiesCollection.insertOne(newFacility);
      res.send(result);
    });

    app.delete("/facilities/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await facilitiesCollection.deleteOne(query);

      res.send(result);
    });

    app.patch("/facilities/:id", async (req, res) => {
      const updatedData = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      updatedDoc = {
        $set: updatedData,
      };
      const result = await facilitiesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // ===========================================================
    // =============== Booking API ===============
    // ===========================================================

    app.get("/bookings", async (req, res) => {
      try {
        const email = req.query.userEmail; // ফ্রন্টএন্ড থেকে ইমেইল কুয়েরি প্যারামিটারে আসবে

        const query = { userEmail: email };

        const result = await bookingCollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // add a new booking
    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await bookingCollection.deleteOne(query);

      res.send(result);
    });

    // ===========================================================
    // Send a ping to confirm a successful connection
    // ===========================================================

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
