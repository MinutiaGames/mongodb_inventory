import { json } from "express";
import { MongoClient, SortDirection } from "mongodb";


export async function generateInventoryTable(client: MongoClient, sortParam: {[key: string]:SortDirection} = {name:1}) {
    const cursor = client.db("simple_inventory").collection("inventory").find().sort(sortParam);

    const results = await cursor.toArray();

    let insertedHtml: string = '';

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
    // Insert the results to the page as json object to allow for manipulation
    // insertedHtml += `<script>let inventoryData = ${JSON.stringify(results)};</script>`;
    
    return insertedHtml;
}