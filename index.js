require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// fHcHsz6neIQG7Vbv
// jobPortal
const uri = `mongodb+srv://${process.env.USER_N}:${process.env.USER_PASS}@cluster0.sfobw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const db = client.db("solop-db");
    const jobCollection = db.collection("jobs");

    app.post("/add-job", async (req, res) => {
      const query = req.body;
      const result = await jobCollection.insertOne(query);
      res.send(result);
    });

    app.get("/job", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get("/job/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { "buyer.email": email };
        const result = await jobCollection.find(query).toArray();
        res.send(result);
      } catch (error) {}
    });

    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });
    // update Single job
    app.get("/single-job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });
    // Update add job
    app.put("/update-job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const jobData = req.body;
      const update = {
        $set: jobData,
      };
      const option = { upsert: true };
      const result = await jobCollection.updateOne(query, update, option);
      res.send(result);
    });

    // Job Details
    app.get("/job-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from SoloSphere Server....");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
