"use strict";

const cellBorderSize = 1;
const cellSize = 50;

const tagName = "dynamic-squares";
const template = document.querySelector("template");

customElements.define(tagName,
    class DynamicSquares extends HTMLElement {
        constructor(){
            super();
            let currentTableWidth = 1,
                currentTableHeight = 1;

            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(template.content.cloneNode(true));

            const squaresTable =  shadowRoot.querySelector("#squares-table table");
            console.log(squaresTable);
            const buttonDeleteTop = shadowRoot.querySelector(".button-delete-top");
            const buttonDeleteLeft = shadowRoot.querySelector(".button-delete-left");
            const buttonAddRight = shadowRoot.querySelector(".button-add-right");
            const buttonAddBottom = shadowRoot.querySelector(".button-add-bottom");

            setupRowsAndColumns(this.rows, this.columns);

            buttonAddRight.addEventListener("click", addColumn);
            buttonAddBottom.addEventListener("click", addRow);
            buttonDeleteLeft.addEventListener("click", deleteRow);
            buttonDeleteTop.addEventListener("click", deleteColumn);

            // show "delete row" button if there's more than 1 row and "delete column" if there's more than 1 column
            // hide delete buttons onmouseleave from elements below
            [squaresTable, buttonDeleteTop, buttonDeleteLeft].forEach(function (element) {
                element.addEventListener("mouseleave", hideDeleteButtons);
                element.addEventListener("mouseover", showDeleteButtons);
            });

            [buttonDeleteLeft, buttonDeleteTop].forEach(function (element) {
                element.addEventListener("click", hideDeleteButtons);
            });

            //move delete buttons according to the mouse position
            squaresTable.addEventListener("mouseover", moveDeleteButtons);

            function setupRowsAndColumns(rowsNumber, columnsNumber) {
                for (let i = 1; i < rowsNumber; i++) addRow();
                for (let i = 1; i < columnsNumber; i++) addColumn();
            }

            function addColumn() {
                for (let row of squaresTable.rows) {
                    let currentRowLastCell = row.cells[currentTableWidth - 1];
                    let clone = currentRowLastCell.cloneNode(true);
                    row.appendChild(clone);
                }
                currentTableWidth++;
            }

            function addRow() {
                let lastRow = squaresTable.rows[currentTableHeight - 1];
                let clone = lastRow.cloneNode(true);
                squaresTable.appendChild(clone);
                currentTableHeight++;
            }

            function deleteRow() {
                if (currentTableHeight === 1) return;
                let rowIndex = parseInt(buttonDeleteLeft.getAttribute("row"));
                squaresTable.deleteRow(rowIndex);
                currentTableHeight--;
                hideDeleteButtons();
            }

            function deleteColumn() {
                if (currentTableWidth === 1) return;
                let colIndex = parseInt(buttonDeleteTop.getAttribute("col"));
                for (let row of squaresTable.rows) {
                    row.deleteCell(colIndex);
                }
                currentTableWidth--;
                hideDeleteButtons();
            }

            function moveDeleteButtons(event) {
                let currentColIndex = event.path[0].cellIndex,
                    currentRowIndex = event.path[1].rowIndex;
                let nextTopDeleteButtonPosition = currentColIndex * (cellSize + cellBorderSize * 2),
                    nextLeftDeleteButtonPosition = currentRowIndex * (cellSize + cellBorderSize * 2);

                buttonDeleteTop.style.marginLeft = nextTopDeleteButtonPosition + "px";
                buttonDeleteLeft.style.marginTop = nextLeftDeleteButtonPosition + "px";

                buttonDeleteLeft.setAttribute("row", currentRowIndex === undefined ?
                    buttonDeleteLeft.getAttribute("row") : currentRowIndex);
                buttonDeleteTop.setAttribute("col", currentColIndex === undefined ?
                    buttonDeleteTop.getAttribute("col") : currentColIndex);
            }

            function hideDeleteButtons() {
                setTimeout(function () {
                    if (shadowRoot.querySelector("table:hover") ||
                    shadowRoot.querySelector(".button-delete:hover")) return;
                    buttonDeleteTop.style.visibility = "hidden";
                    buttonDeleteLeft.style.visibility = "hidden";
                }, 500)
            }


            function showDeleteButtons() {
                buttonDeleteLeft.style.visibility = currentTableHeight > 1 ? "visible" : "hidden";
                buttonDeleteTop.style.visibility = currentTableWidth > 1 ? "visible" : "hidden";
            }
        }

        get columns() {
            return this.getAttribute("columns");
        }

        set columns(columnsNumber) {
            this.setAttribute("columns", columnsNumber);
        }

        get rows() {
            return this.getAttribute("rows");
        }

        set rows(rowsNumber) {
            this.setAttribute("rows", rowsNumber);
        }
    });






