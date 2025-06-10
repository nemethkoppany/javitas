const sortState = {};

function tablecreation(container, callback) {
  const tableDiv = document.createElement("div");
  container.appendChild(tableDiv);

  const table = document.createElement("table");
  table.id = "table";
  tableDiv.appendChild(table);

  const thead = document.createElement("thead");
  table.appendChild(thead);

  const headerRow = document.createElement("tr");
  thead.appendChild(headerRow);

  const headers = ["Megnevezés", "Hely", "Hónap", "Összeg"];

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.textContent = headers[i];
    th.addEventListener("click", function () {
      sortTable(i);
    });
    headerRow.appendChild(th);
  }

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  callback(tbody);
}

function upload(tbody, container, tomb) {
  const countDiv = document.createElement("div");
  container.appendChild(countDiv);

  const cellCountDiv = document.createElement("div");
  container.appendChild(cellCountDiv);

  const osszegzesDiv = document.createElement("div");
  container.appendChild(osszegzesDiv);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  container.appendChild(fileInput);

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const lines = reader.result.split("\n");
      const cleanLines = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.length > 0){ 
          cleanLines.push(line)
        };
      }

      const dataLines = cleanLines.slice(1);

      tomb.length = 0;
      tbody.innerHTML = "";

      let totalOsszeg = 0;

      for (let i = 0; i < dataLines.length; i++) {
        const parts = dataLines[i].split(";");
        if (parts.length < 4){ 
          continue
        };

        const obj = {
          megnevezes: parts[0],
          hely: parts[1],
          honap: parts[2],
          osszeg: parts[3]
        };

        tomb.push(obj);

        rowAddition(obj, tbody);

        const num = parseFloat(obj.osszeg);
        if (!isNaN(num)) {
          totalOsszeg += num;
        }
      }

      const table = document.getElementById("table");
      const rows = table.querySelectorAll("tr");
      let totalCells = 0;
      for (let i = 0; i < rows.length; i++) {
        totalCells += rows[i].cells.length;
      }
      cellCountDiv.textContent = "Összes cella a táblázatban: " + totalCells;
    };

    reader.readAsText(file);
  });
}

function rowAddition(obj, tbody) {
  const tr = document.createElement("tr");

  const megnevezesTd = document.createElement("td");
  megnevezesTd.textContent = obj.megnevezes;
  tr.appendChild(megnevezesTd);

  const helyTd = document.createElement("td");
  helyTd.textContent = obj.hely;
  tr.appendChild(helyTd);

  const honapTd = document.createElement("td");
  honapTd.textContent = obj.honap;
  tr.appendChild(honapTd);

  const osszegTd = document.createElement("td");
  osszegTd.textContent = obj.osszeg;

  const num = parseFloat(obj.osszeg);
   if (num < 0) {
    osszegTd.classList.add("red");
  } else {
    osszegTd.classList.add("green");
  }

  tr.appendChild(osszegTd);

  tbody.appendChild(tr);
}

function sortTable(columnIndex) {
  const table = document.getElementById("table");
  const tbody = table.querySelector("tbody");

  const rows = [];
  for (let i = 0; i < tbody.rows.length; i++) {
    rows.push(tbody.rows[i]);
  }

  if (!sortState[columnIndex] || sortState[columnIndex] === 1) {
    sortState[columnIndex] = -1;
  } else {
    sortState[columnIndex] = 1;
  }
  const direction = sortState[columnIndex];

  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < rows.length - 1 - i; j++) {
      const cellTextA = rows[j].cells[columnIndex].textContent.trim();
      const cellTextB = rows[j + 1].cells[columnIndex].textContent.trim();

      const numA = parseFloat(cellTextA);
      const numB = parseFloat(cellTextB);

      let swap = false;

      if (!isNaN(numA) && !isNaN(numB)) {
        if (direction === 1) {
          if (numA > numB) {
            swap = true;
          }
        } else {
          if (numA < numB) {
            swap = true;
          }
        }
      } else {
        const lowerA = cellTextA.toLowerCase();
        const lowerB = cellTextB.toLowerCase();

        if (direction === 1) {
          if (lowerA > lowerB) {
            swap = true;
          }
        } else {
          if (lowerA < lowerB) {
            swap = true;
          }
        }
      }

      if (swap) {
        const temp = rows[j];
        rows[j] = rows[j + 1];
        rows[j + 1] = temp;
      }
    }
  }

  tbody.innerHTML = "";
  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }
}


