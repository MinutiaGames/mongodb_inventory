function openItemEditWindow(tableRow: HTMLTableRowElement) {
    const itemId: string | null = tableRow.children[0].textContent;
    const itemName: string | null = tableRow.children[1].textContent;
    const itemUnit: string | null = tableRow.children[2].textContent;
    const itemQuantity: number = parseInt(tableRow.children[3].textContent || "");

    console.log(`Item ID: ${itemId}`);
    console.log(`Name: ${itemName}`);
    console.log(`Unit Measurement : ${itemUnit}`);
    console.log(`Quantity: ${itemQuantity}`);
}