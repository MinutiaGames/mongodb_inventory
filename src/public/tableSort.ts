function sortTableByColumn(table: HTMLTableElement | null, column: number, asc = true) {
    if (table === null) {
        console.error("Table cannot be null");
        return;
    }
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`)?.textContent?.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`)?.textContent?.trim();

        if (aColText === undefined || bColText === undefined) {
            console.error("aColText and/or bColText is undefined");
            return 0;
        }

        //if (parseInt(aColText) != NaN) aCo

        const aCol = parseInt(aColText) === NaN ? aColText : parseInt(aColText);
        const bCol = parseInt(bColText) === NaN ? bColText : parseInt(bColText);

        if (aColText.match(/^\d+$/) != null || bColText.match(/^\d+$/) != null) {
            return parseInt(aColText) > parseInt(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
        }

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the columns are sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`)?.classList.toggle("th-sort-desc", !asc);
    table.querySelector(`th:nth-child(${column + 1})`)?.classList.toggle("th-sort-asc", asc);
}

window.addEventListener('load', (event) => {
    // sortTableByColumn(document.querySelector("table"), 0, true);
    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            const tableElement = headerCell.parentElement?.parentElement?.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement?.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");

            if (tableElement === null || tableElement === undefined) {
                console.error("Why");
                return 0;
            }

            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    })
})
