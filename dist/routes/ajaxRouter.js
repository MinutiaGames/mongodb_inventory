"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
exports.router = express_1.default.Router();
dotenv_1.default.config();
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
exports.router.post("/sort", async (req, res) => {
    const client = new mongodb_1.MongoClient(uri);
    try {
        await client.connect();
        const cursor = client.db("simple_inventory").collection("inventory").find({}).sort({ [req.body.column]: req.body.ascend });
        const results = await cursor.toArray();
        res.send(results);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await client.close();
    }
});
exports.router.post("/add", async (req, res) => {
    const client = new mongodb_1.MongoClient(uri);
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
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await client.close();
    }
});
