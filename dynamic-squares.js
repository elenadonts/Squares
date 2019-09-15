"use strict";

const cellBorderSize = 1;
const cellSize = 70;
const initialLeftMargin = cellSize + cellBorderSize * 2;

const tagName = "dynamic-squares";
const template = document.querySelector("template");

customElements.define(tagName,
    class DynamicSquares extends HTMLElement {
        constructor(){
            super();
            let currentTableWidth = 1;
            let currentTableHeight = 1;
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(template.content.cloneNode(true));

            const squaresTable =  shadowRoot.querySelector("#squares-table");
            const topDeleteButton = shadowRoot.querySelector("#top-delete-button");
            const leftDeleteButton = shadowRoot.querySelector("#left-delete-button");
            const rightAddButton = shadowRoot.querySelector("#right-add-button");
            const bottomAddButton = shadowRoot.querySelector("#bottom-add-button");

            rightAddButton.addEventListener("click", addColumn);
            bottomAddButton.addEventListener("click", addRow);
            leftDeleteButton.addEventListener("click", deleteRow);
            topDeleteButton.addEventListener("click", deleteColumn);

            // show "delete row" button if there's more than 1 row and "delete column" if there's more than 1 column
            // hide delete buttons onmouseleave from elements below
            [squaresTable, topDeleteButton, leftDeleteButton].forEach(function (element) {
                element.addEventListener("mouseleave", hideDeleteButtons.bind(this, false));
                element.addEventListener("mouseover", showDeleteButtons);
            });

            //move delete buttons according to the mouse position
            squaresTable.addEventListener("mouseover", moveDeleteButtons);

            function addColumn() {
                for (let row of squaresTable.rows){
                    let currentRowLastCell = row.cells[currentTableWidth - 1];
                    let clone = currentRowLastCell.cloneNode(true);
                    row.appendChild(clone);
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
                if (currentTableWidth === 1) return;
                for (let row of squaresTable.rows){
                    row.deleteCell(-1);
                }
                hideDeleteButtons(true);
                currentTableWidth--;
            }

            function moveDeleteButtons(event){
                let currentColIndex = event.path[0].cellIndex;
                let currentRowIndex = event.path[1].rowIndex;
                let nextTopDeleteButtonPosition = currentColIndex * (cellSize + cellBorderSize * 2) + initialLeftMargin;
                let nextLeftDeleteButtonPosition = currentRowIndex * (cellSize + cellBorderSize * 2);
                topDeleteButton.style.marginLeft = nextTopDeleteButtonPosition + "px";
                leftDeleteButton.style.marginTop = nextLeftDeleteButtonPosition + "px";
            }

            function hideDeleteButtons(elementWasDeleted) {
                if (!elementWasDeleted && (leftDeleteButton.matches(":hover") ||
                    topDeleteButton.matches(":hover")))
                    return;

                topDeleteButton.style.display = "none";
                leftDeleteButton.style.display = "none";
            }

            function showDeleteButtons(){
                let leftButtonVisibility = currentTableHeight > 1 ? "block" : "none";
                let topButtonVisibility = currentTableWidth > 1 ? "block" : "none";
                leftDeleteButton.style.display = leftButtonVisibility;
                topDeleteButton.style.display = topButtonVisibility;
            }
        }
    });






