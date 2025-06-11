let countDiv;

function tablecreation(container, callback) {
    const formDiv = document.createElement("div");
    container.appendChild(formDiv);

    const form = document.createElement("form");
    formDiv.appendChild(form);

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
    for (let i = 0; i < thead_content.length; i++) {
        const th = document.createElement("th");
        th.textContent = thead_content[i];
        tr.appendChild(th);
    }

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    countDiv = document.createElement("div");
    container.appendChild(countDiv);

    callback(tbody);
}


const upload = (tbody, container) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileinput";
    container.appendChild(fileInput);

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const Lines = reader.result.split("\n");
            const headerRemoved = Lines.slice(1);

            for (const line of headerRemoved) {
                const trimmed = line.trim();

                const fields = trimmed.split(";");
                const tranzakcio = {
                    megnevezes: fields[0],
                    hely: fields[1],
                    honap: fields[2],
                    osszeg: fields[3]
                };

                tomb.push(tranzakcio);
                rowAddition(tranzakcio, tbody);
            }

            const table = document.getElementById("table");
            let count = 0;
            for (let row of table.rows) {
                count += row.cells.length;
            }

            countDiv.textContent = `Összes elem: ${count}`;
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
   tr.appendChild(osszeg);
    const szam_osszeg = parseInt(obj.osszeg);

    if (szam_osszeg < 0) {
        osszeg.classList.add("red");
    } else {
        osszeg.classList.add("green");
    }

    tr.appendChild(osszeg);
    tbody.appendChild(tr);
}

