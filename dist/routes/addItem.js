"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const generateInventoryTable_1 = require("../generateInventoryTable");
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
            quantity: parseInt(req.body.itemQuantity)
        });
        const insertedHtml = (await (0, generateInventoryTable_1.generateInventoryTable)(client)).toString();
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
