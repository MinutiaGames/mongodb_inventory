import express from "express";
import { MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";
import { generateInventoryTable } from "../generateInventoryTable";

dotenv.config();

export const router = express.Router();

const uri: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

router.post("/", async (req, res) => {
    
    const client: MongoClient = new MongoClient(uri);

    try {
        await client.connect();
        
        await createListing(client, {
            itemId: req.body.itemId,
            name: req.body.itemName,
            unitMeasurement: req.body.itemUnit,
            quantity: parseInt(req.body.itemQuantity)
        });

        const insertedHtml = (await generateInventoryTable(client)).toString();

        res.render("index", {
            inventory: insertedHtml
        });
        
    } catch (error) {
        console.log("There's an error");
        console.log(error)
    } finally {
        await client.close();
    }
});

async function createListing(client: MongoClient, newListing: object) {
    const result = await client.db("simple_inventory").collection("inventory").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}