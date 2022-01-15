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
        // .limit(50);

        const results = await cursor.toArray();

        res.send(results);
        // console.log(req.body.column);

    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }
    
    
});