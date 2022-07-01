const express = require('express');
const app = express();
const cors=require('cors')
const port = process.env.PORT||5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vzmig.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log("Mongo is connected to Power");

        const billingCollection=client.db("Power_Hack").collection("Billing_list");

        // api for inserting billing_list

        app.post('/api/add-billing',async(req,res)=>{
            const bills=req.body;
            const billingList=await billingCollection.insertOne(bills);
            res.send({data:billingList});
          });

          //api for collecting billing list
        app.get('/api/billing-list',async(req,res)=>{
            const limit=Number(req.query.limit);
            const pageNo=Number(req.query.pageNumber);

            const body=req.query;
            console.log(body);

            const count=await billingCollection.estimatedDocumentCount();
            
            const billingList=await billingCollection.find().skip(limit*pageNo).limit(limit).toArray();
            res.send({data:billingList,count:count});
          });

          //api for delete bill
          app.delete('/api/delete-billing/:id',async(req,res)=>{
            const id =req.params.id;
            const filter={_id:ObjectId(id)};
            const deletedBill=await billingCollection.deleteOne(filter);
            res.send(deletedBill);
          })



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