const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// use the middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("doctors_portal");
    const appoinmentsCollection = database.collection("appoinments");
    const usersCollection = database.collection("users");

    // post appoinments
    app.post("/appoinments", async (req, res) => {
      const appoinment = req.body;
      const result = await appoinmentsCollection.insertOne(appoinment);
      res.json(result);
    //   console.log(result);
    });

    app.get("/appoinments", async (req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      const query = { email: email, date: date };
      // console.log(query)
      const cursor = appoinmentsCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // store the user in mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
    //   console.log(result);
      res.json(result);
    });

    app.put('/users',async(req,res) => {
        const user = req.body ;
        const filter = {email : user.email};
        const options = {upsert : true};
        const updateDoc = {$set: user};
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });

    // set admin for the website
    app.put('/users/admin', async(req,res) => {
        const user = req.body ;
        console.log("put admin user",user)
        const filter = {email : user.email};
        const updateDoc = {$set : {role: "admin"}};
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result)
    })

    // get an admin 
    app.get('/users/:email', async(req,res) => {
        const email = req.params.email ;
        const query = {email : email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false ;
        if(user?.role === "admin") {
            isAdmin = true
        }
        res.json({admin : isAdmin})
    })

  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Doctors Portal");
  console.log("Everything is ok all fine in the server ");
});

app.listen(port, () => {
  console.log(`Listening to the ${port} successfully`);
});
