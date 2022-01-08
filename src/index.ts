import { ChangeStream, MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true}));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

app.use(express.static(path.join(__dirname, '../public')));

const uri: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.post("/", async (req, res) => {
    
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

main().catch(console.error);

async function main() {
    
    const client: MongoClient = new MongoClient(uri);

    try {
        await client.connect();

        const insertedHtml = (await generateInventoryTable(client)).toString();

        app.get("/", (req, res) => {
        res.render("index", {
            inventory: insertedHtml
        });
    });

    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }

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

async function monitorInventoryChanges(client: MongoClient, timeInMs = 60000, pipeline = []) {
    const collection = client.db("simple_inventory").collection("inventory");
    
    const changeStream = collection.watch(pipeline);
    
    changeStream.on('change', (next) => {
        console.log(next);
        main().catch(console.error);
    });
    
    await closeChangeStream(timeInMs, changeStream);
}

async function closeChangeStream(timeInMs = 60000, changeStream: ChangeStream) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs);
    })
}

async function createListing(client: MongoClient, newListing: object) {
    const result = await client.db("simple_inventory").collection("inventory").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}