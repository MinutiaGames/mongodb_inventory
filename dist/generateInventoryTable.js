"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInventoryTable = void 0;
async function generateInventoryTable(client, sortParam = { name: 1 }) {
    const cursor = client.db("simple_inventory").collection("inventory").find().sort(sortParam);
    const results = await cursor.toArray();
    let insertedHtml = '';
    results.forEach((result, i) => {
        if (result.itemId != "ABC123") {
            insertedHtml += "<tr class='inventory-hover' onclick='openItemEditWindow(this)'>";
            insertedHtml += `<td>${result.itemId}</td>`;
            insertedHtml += `<td>${result.name}</td>`;
            insertedHtml += `<td>${result.unitMeasurement}</td>`;
            insertedHtml += `<td>${result.quantity}</td>`;
            insertedHtml += "</tr>";
        }
    });
    return insertedHtml;
}
exports.generateInventoryTable = generateInventoryTable;
