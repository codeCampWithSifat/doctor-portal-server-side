const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;


// use the middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('doctors_portal');
        const appoinmentsCollection = database.collection("appoinments");

        // 

    } finally {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/' ,(req,res) => {
    res.send('Hello Doctors Portal');
    console.log('Everything is ok all fine in the server ')
});


app.listen(port, () => {
    console.log(`Listening to the ${port} successfully`);
})