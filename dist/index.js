"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const addItem_1 = require("./routes/addItem");
const sortInventory_1 = require("./routes/sortInventory");
const generateInventoryTable_1 = require("./generateInventoryTable");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist/public')));
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xsu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
app.use('/addItem', addItem_1.router);
app.use('/sort', sortInventory_1.router);
main().catch(console.error);
async function main() {
    const client = new mongodb_1.MongoClient(uri);
    try {
        await client.connect();
        const insertedHtml = (await (0, generateInventoryTable_1.generateInventoryTable)(client)).toString();
        app.get("/", (req, res) => {
            res.render("index", {
                inventory: insertedHtml
            });
        });
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await client.close();
    }
}
