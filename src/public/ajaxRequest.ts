////// Add Item
async function addItem() {
    const addItemElem = document.getElementById('addItem')!;
    const itemIdElem = addItemElem.children[0].children[0] as HTMLInputElement;
    const nameElem = addItemElem.children[0].children[0] as HTMLInputElement;
    const unitElem = addItemElem.children[0].children[0] as HTMLInputElement;
    const quantityElem = addItemElem.children[0].children[0] as HTMLInputElement;
    
    const newItem = {
        itemId: itemIdElem.value,
        name: nameElem.value,
        unitMeasurement: unitElem.value,
        quantity: quantityElem.value
    }

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

function insertItemToTable(data: string) {
    console.log(JSON.parse(data));
}


////// Sort Table
let sortAscend = true;

async function sortColumn(column: string) {
    
    const tBody = document.querySelector("tbody")!;
    tBody.classList.add('loading-background');
    
    const data = {
        column: column,
        ascend: sortAscend ? 1 : -1
    }

    sortAscend = !sortAscend;
    
    await fetch('/ajax/sort', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())

    // This is where the data is actually retrieved; right now I'm converting a string into json, so there's probably a better way to do it
    .then(data => generateNewTable(data));
}

function generateNewTable(data: string) {

    const tBody = document.querySelector("tbody")!;

    tBody.classList.remove('loading-background');

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    const result = JSON.parse(data);

    result.forEach((result: { itemId: string; name: string; unitMeasurement: string; quantity: number; }) => {

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