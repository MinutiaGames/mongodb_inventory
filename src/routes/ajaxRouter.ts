import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

export const router = express.Router();

dotenv.config();

const uri: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

router.post("/sort", async (req, res) => {
    
    const client: MongoClient = new MongoClient(uri);

    try {
        await client.connect();
        const cursor = client.db("simple_inventory").collection("inventory").find({}).sort({[req.body.column]: req.body.ascend});

        const results = await cursor.toArray();

        res.send(results);

    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }
    
});

router.post("/add", async (req, res) => {
    
    const client: MongoClient = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('error');
        const result = client.db("simple_inventory").collection("inventory").insertOne({
            itemId: req.body.itemId,
            name: req.body.name,
            unitMeasurement: req.body.unitMeasurement,
            quantity: req.body.quantity
        });

        res.send(result);

    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }

})