"use strict";
function openItemEditWindow(tableRow) {
    const itemId = tableRow.children[0].textContent;
    const itemName = tableRow.children[1].textContent;
    const itemUnit = tableRow.children[2].textContent;
    const itemQuantity = parseInt(tableRow.children[3].textContent || "");
    console.log(`Item ID: ${itemId}`);
    console.log(`Name: ${itemName}`);
    console.log(`Unit Measurement : ${itemUnit}`);
    console.log(`Quantity: ${itemQuantity}`);
}
