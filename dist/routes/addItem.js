"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.router = express_1.default.Router();
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
exports.router.post("/", async (req, res) => {
    const client = new mongodb_1.MongoClient(uri);
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
    }
    catch (error) {
        console.log("There's an error");
        console.log(error);
    }
    finally {
        await client.close();
    }
});
async function createListing(client, newListing) {
    const result = await client.db("simple_inventory").collection("inventory").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function generateInventoryTable(client, sortParam = { name: 1 }) {
    const cursor = client.db("simple_inventory").collection("inventory").find().sort(sortParam);
    const results = await cursor.toArray();
    let insertedHtml = '';
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
