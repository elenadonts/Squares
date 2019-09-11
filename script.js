"use strict";

let currentTableWidth = 1;
let currentTableHeight = 1;

const cellBorderSize = 1;
const cellSize = 70;
const initialLeftMargin = cellSize + cellBorderSize * 3;

const squaresTable = document.getElementById("squares-table");
const topDeleteButton = document.getElementById("top-delete-button");
const leftDeleteButton = document.getElementById("left-delete-button");

function addRow() {
    let lastRow = squaresTable.rows[currentTableHeight - 1];
    let clone = lastRow.cloneNode(true);
    squaresTable.appendChild(clone);
    currentTableHeight++;
}

function addColumn() {
    for (let i = 0; i < currentTableHeight; i++){
        let currentRow = squaresTable.rows[i];
        let currentRowLastCell = squaresTable.rows[i].cells[currentTableWidth - 1];
        let clone = currentRowLastCell.cloneNode(true);
        currentRow.appendChild(clone);
    }
    currentTableWidth++;
}

function deleteRow(){
    if (currentTableHeight === 1) return;
    squaresTable.deleteRow(currentTableHeight - 1);
    hideDeleteButtons(true);
    currentTableHeight--;
}

function deleteColumn(){
    for (let i = 0; i < currentTableHeight; i++){
        let currentRow = squaresTable.rows[i];
        currentRow.deleteCell(-1);
    }
    hideDeleteButtons(true);
    currentTableWidth--;
}

function moveDeleteButtons(currentCell) {
    let currentRowIndex = currentCell.parentElement.rowIndex;
    let currentColIndex = currentCell.cellIndex;
    let nextTopDeleteButtonPosition = currentColIndex * (cellSize + cellBorderSize * 2) + initialLeftMargin;
    let nextLeftDeleteButtonPosition = currentRowIndex * (cellSize + cellBorderSize * 2);
    topDeleteButton.style.marginLeft = nextTopDeleteButtonPosition + "px";
    leftDeleteButton.style.marginTop = nextLeftDeleteButtonPosition + "px";
}

function hideDeleteButtons(elementWasDeleted) {
    if (!elementWasDeleted && (leftDeleteButton.matches(":hover") || topDeleteButton.matches(":hover")))
        return;

    topDeleteButton.style.visibility = "hidden";
    leftDeleteButton.style.visibility = "hidden";
}

function showDeleteButtons(){
    let leftButtonVisibility = currentTableWidth > 1 ? "visible" : "hidden";
    let topButtonVisibility = currentTableHeight > 1 ? "visible" : "hidden";
    leftDeleteButton.style.visibility = leftButtonVisibility;
    topDeleteButton.style.visibility = topButtonVisibility;
}

// hide delete buttons onmouseleave from elements below
[squaresTable, topDeleteButton, leftDeleteButton].forEach(function (element) {
    element.addEventListener("mouseleave",
        () => hideDeleteButtons(false));
});

// show "delete row" button if there's more than 1 row and "delete column" if there's more than 1 column
[squaresTable, topDeleteButton, leftDeleteButton].forEach(function (element) {
    element.addEventListener("mouseover", showDeleteButtons);
});


