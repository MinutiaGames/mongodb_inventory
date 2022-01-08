import express from "express";
import { MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";

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
            quantity: req.body.itemQuantity
        });

        const insertedHtml = (await generateInventoryTable(client)).toString();

        res.render("index", {
            inventory: insertedHtml
        });
        
        // res.redirect('/');
        
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

async function generateInventoryTable(client: MongoClient, sortParam: {[key: string]:SortDirection} = {name:1}) {
    const cursor = client.db("simple_inventory").collection("inventory").find().sort(sortParam);

    const results = await cursor.toArray();

    let insertedHtml: string = '';

    results.forEach((result, i) => {
        if (result.itemId != "ABC123") {
            insertedHtml += "<tr>";
            insertedHtml += `<td>${result.itemId}</td>`;
            insertedHtml += `<td>${result.name}</td>`;
            insertedHtml += `<td>${result.unitMeasurement}</td>`;
            insertedHtml += `<td>${result.quantity}</td>`;
            insertedHtml += "</tr>";
        }
    });
    
    return insertedHtml;
}

// module.exports = router;