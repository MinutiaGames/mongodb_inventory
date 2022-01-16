"use strict";
async function addItem() {
    const addItemElem = document.getElementById('addItem');
    const itemIdElem = addItemElem.children[0].children[0];
    const nameElem = addItemElem.children[0].children[0];
    const unitElem = addItemElem.children[0].children[0];
    const quantityElem = addItemElem.children[0].children[0];
    const newItem = {
        itemId: itemIdElem.value,
        name: nameElem.value,
        unitMeasurement: unitElem.value,
        quantity: quantityElem.value
    };
    console.log(newItem);
    await fetch('/ajax/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
        .then(response => response.text())
        .then(data => insertItemToTable(data));
}
function insertItemToTable(data) {
    console.log(JSON.parse(data));
}
let sortAscend = true;
async function sortColumn(column) {
    const tBody = document.querySelector("tbody");
    tBody.classList.add('loading-background');
    const data = {
        column: column,
        ascend: sortAscend ? 1 : -1
    };
    sortAscend = !sortAscend;
    await fetch('/ajax/sort', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(data => generateNewTable(data));
}
function generateNewTable(data) {
    const tBody = document.querySelector("tbody");
    tBody.classList.remove('loading-background');
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    const result = JSON.parse(data);
    result.forEach((result) => {
        if (result.itemId != "ABC123") {
            let tr = document.createElement('tr');
            tr.classList.add('inventory-hover');
            let itemId = document.createElement('td');
            itemId.innerHTML = result.itemId;
            let name = document.createElement('td');
            name.innerHTML = result.name;
            let unitMeasurement = document.createElement('td');
            unitMeasurement.innerHTML = result.unitMeasurement;
            let quantity = document.createElement('td');
            quantity.innerHTML = result.quantity.toString();
            tr.appendChild(itemId);
            tr.appendChild(name);
            tr.appendChild(unitMeasurement);
            tr.appendChild(quantity);
            tBody.appendChild(tr);
        }
    });
}
