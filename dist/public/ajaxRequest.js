"use strict";
async function main() {
    await fetch('/ajax', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: 'Sending from the page' })
    })
        .then(response => response.text())
        .then(data => console.log(JSON.parse(data)));
}
