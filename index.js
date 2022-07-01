const express = require('express');
const app = express();
const cors=require('cors')
const port = process.env.PORT||5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vzmig.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log("Mongo is connected to Power");

        const billingCollection=client.db("Power_Hack").collection("Billing_list");

        // api for inserting billing_list

        app.post('/api/billing-list',async(req,res)=>{
            const bills=req.body;
            const billingList=await billingCollection.insertOne(bills);
            res.send({data:billingList});
          });
        app.get('/api/billing-list',async(req,res)=>{
            const billingList=await billingCollection.find().toArray();
            res.send({data:billingList});
          });


    }

    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Power HACK')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })