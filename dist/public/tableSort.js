"use strict";
function sortTableByColumn(table, column, asc = true) {
    var _a, _b;
    if (table === null) {
        console.error("Table cannot be null");
        return;
    }
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));
    const sortedRows = rows.sort((a, b) => {
        var _a, _b, _c, _d;
        const aColText = (_b = (_a = a.querySelector(`td:nth-child(${column + 1})`)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        const bColText = (_d = (_c = b.querySelector(`td:nth-child(${column + 1})`)) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
        if (aColText === undefined || bColText === undefined) {
            console.error("aColText and/or bColText is undefined");
            return 0;
        }
        const aCol = parseInt(aColText) === NaN ? aColText : parseInt(aColText);
        const bCol = parseInt(bColText) === NaN ? bColText : parseInt(bColText);
        if (aColText.match(/^\d+$/) != null || bColText.match(/^\d+$/) != null) {
            return parseInt(aColText) > parseInt(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
        }
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    tBody.append(...sortedRows);
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    (_a = table.querySelector(`th:nth-child(${column + 1})`)) === null || _a === void 0 ? void 0 : _a.classList.toggle("th-sort-desc", !asc);
    (_b = table.querySelector(`th:nth-child(${column + 1})`)) === null || _b === void 0 ? void 0 : _b.classList.toggle("th-sort-asc", asc);
}
window.addEventListener('load', (event) => {
    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            var _a, _b, _c;
            const tableElement = (_b = (_a = headerCell.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
            const headerIndex = Array.prototype.indexOf.call((_c = headerCell.parentElement) === null || _c === void 0 ? void 0 : _c.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");
            if (tableElement === null || tableElement === undefined) {
                console.error("Why");
                return 0;
            }
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
});
