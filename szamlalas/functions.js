 const sortState = {};

    function tablecreation(container, callback) {
      const tableDiv = document.createElement("div");
      container.appendChild(tableDiv);

      const table = document.createElement("table");
      table.id = "table";
      tableDiv.appendChild(table);

      const thead = document.createElement("thead");
      table.appendChild(thead);

      const tr = document.createElement("tr");
      thead.appendChild(tr);

      const thead_content = ["Megnevezés", "Hely", "Hónap", "Összeg"];
      thead_content.forEach((text, i) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.dataset.index = i;
        th.addEventListener("click", () => sortTable(i));
        tr.appendChild(th);
      });

      const tbody = document.createElement("tbody");
      table.appendChild(tbody);

      callback(tbody);
    }

    const upload = (tbody, container) => {
      const countDiv = document.createElement("div");
      container.appendChild(countDiv);

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'fileinput';
      container.appendChild(fileInput);

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const lines = reader.result.split('\n').map(line => line.trim()).filter(line => line);
          const dataLines = lines.slice(1); // remove header

          tbody.innerHTML = ''; // clear existing rows
          tomb.length = 0;

          for (const line of dataLines) {
            const [megnevezes, hely, honap, osszeg] = line.split(';');
            const obj = { megnevezes, hely, honap, osszeg };
            tomb.push(obj);
            rowAddition(obj, tbody);
          }

          countDiv.textContent = `A táblázatban ${tbody.rows.length} tranzakció található.`;
        };

        reader.readAsText(file);
      });
    };

    const rowAddition = (obj, tbody) => {
      const tr = document.createElement("tr");

      const megnevezes = document.createElement("td");
      megnevezes.textContent = obj.megnevezes;
      tr.appendChild(megnevezes);

      const hely = document.createElement("td");
      hely.textContent = obj.hely;
      tr.appendChild(hely);

      const honap = document.createElement("td");
      honap.textContent = obj.honap;
      tr.appendChild(honap);

      const osszeg = document.createElement("td");
      osszeg.textContent = obj.osszeg;

      const szam = parseInt(obj.osszeg);
      osszeg.classList.add(szam < 0 ? "red" : "green");

      tr.appendChild(osszeg);
      tbody.appendChild(tr);
    };

    const sortTable = (columnIndex) => {
      const table = document.getElementById("table");
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));

      const asc = sortState[columnIndex] !== 'asc';
      sortState[columnIndex] = asc ? 'asc' : 'desc';

      rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;

        const aVal = isNaN(aText) ? aText : parseFloat(aText);
        const bVal = isNaN(bText) ? bText : parseFloat(bText);

        if (aVal < bVal) return asc ? -1 : 1;
        if (aVal > bVal) return asc ? 1 : -1;
        return 0;
      });

      tbody.innerHTML = '';
      rows.forEach(row => tbody.appendChild(row));
    };

    // Inicializálás
    const container = document.body;
    tablecreation(container, (tbody) => {
      upload(tbody, container);
    });