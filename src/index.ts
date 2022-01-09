import { ChangeStream, MongoClient, SortDirection } from "mongodb";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import {router as addItemRouter} from "./routes/addItem"
import {router as sortTypeRouter} from "./routes/sortInventory"
import { generateInventoryTable } from "./generateInventoryTable";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true}));
app.use(express.json());

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

app.use(express.static(path.join(__dirname, '../dist/public')));

const uri: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use('/addItem', addItemRouter);
app.use('/sort', sortTypeRouter);

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

// async function monitorInventoryChanges(client: MongoClient, timeInMs = 60000, pipeline = []) {
//     const collection = client.db("simple_inventory").collection("inventory");
    
//     const changeStream = collection.watch(pipeline);
    
//     changeStream.on('change', (next) => {
//         console.log(next);
//         main().catch(console.error);
//     });
    
//     await closeChangeStream(timeInMs, changeStream);
// }

// async function closeChangeStream(timeInMs = 60000, changeStream: ChangeStream) {
//     return new Promise<void>((resolve) => {
//         setTimeout(() => {
//             console.log("Closing the change stream");
//             changeStream.close();
//             resolve();
//         }, timeInMs);
//     })
// }