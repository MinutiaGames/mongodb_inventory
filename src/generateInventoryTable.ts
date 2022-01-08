import { MongoClient, SortDirection } from "mongodb";


export async function generateInventoryTable(client: MongoClient, sortParam: {[key: string]:SortDirection} = {name:1}) {
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