"use strict";

let currentTableWidth = 1;
let currentTableHeight = 1;

const cellBorderSize = 1;
const cellSize = 70;
const initialLeftMargin = cellSize + cellBorderSize * 3;

const tagName = "dynamic-squares";
const template = document.querySelector("template");

customElements.define(tagName,
    class DynamicSquares extends HTMLElement {
        constructor(){
            super();
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(template.content.cloneNode(true));

            const squaresTable =  shadowRoot.querySelector("#squares-table");
            const topDeleteButton = shadowRoot.querySelector("#top-delete-button");
            const leftDeleteButton = shadowRoot.querySelector("#left-delete-button");
            const rightAddButton = shadowRoot.querySelector("#right-add-button");
            const bottomAddButton = shadowRoot.querySelector("#bottom-add-button");

            //move delete buttons according to the mouse position
            squaresTable.addEventListener("mouseover", function (mousePosition) {
                let currentColIndex = mousePosition.path[0].cellIndex;
                let currentRowIndex = mousePosition.path[1].rowIndex;
                let nextTopDeleteButtonPosition = currentColIndex * (cellSize + cellBorderSize * 2) + initialLeftMargin;
                let nextLeftDeleteButtonPosition = currentRowIndex * (cellSize + cellBorderSize * 2);
                topDeleteButton.style.marginLeft = nextTopDeleteButtonPosition + "px";
                leftDeleteButton.style.marginTop = nextLeftDeleteButtonPosition + "px";
            });

            // hide delete buttons onmouseleave from elements below
            [squaresTable, topDeleteButton, leftDeleteButton].forEach(function (element) {
                element.addEventListener("mouseleave",
                    () => hideDeleteButtons(false));
            });

            // show "delete row" button if there's more than 1 row and "delete column" if there's more than 1 column
            [squaresTable, topDeleteButton, leftDeleteButton].forEach(function (element) {
                element.addEventListener("mouseover", showDeleteButtons);
            });

            rightAddButton.addEventListener("click", addColumn);
            bottomAddButton.addEventListener("click", addRow);
            leftDeleteButton.addEventListener("click", deleteRow);
            topDeleteButton.addEventListener("click", deleteColumn);

            function addColumn() {
                for (let i = 0; i < currentTableHeight; i++){
                    let currentRow = squaresTable.rows[i];
                    let currentRowLastCell = squaresTable.rows[i].cells[currentTableWidth - 1];
                    let clone = currentRowLastCell.cloneNode(true);
                    currentRow.appendChild(clone);
                }
                currentTableWidth++;
            }

            function addRow(){
                let lastRow = squaresTable.rows[currentTableHeight - 1];
                let clone = lastRow.cloneNode(true);
                squaresTable.appendChild(clone);
                currentTableHeight++;
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
        }
    });






