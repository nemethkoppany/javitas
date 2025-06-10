function tableAndFormCreation(container, callback) {
    const filterDiv = document.createElement("div");
    container.appendChild(filterDiv);

    const osszegDiv = document.createElement("div");
    filterDiv.appendChild(osszegDiv);

    const szuroForm = document.createElement("form");
    filterDiv.appendChild(szuroForm);

    const megnevezesLabel = document.createElement("label");
    megnevezesLabel.textContent = "Megnevezés: ";
    szuroForm.appendChild(megnevezesLabel);
    const megnevezesInput = document.createElement("input");
    szuroForm.appendChild(megnevezesInput);

    szuroForm.appendChild(document.createElement("br"));

    const osszegLabel = document.createElement("label");
    osszegLabel.textContent = "Összeg: ";
    szuroForm.appendChild(osszegLabel);
    const osszegInput = document.createElement("input");
    osszegInput.type = "number";
    szuroForm.appendChild(osszegInput);

    szuroForm.appendChild(document.createElement("br"));

    const honapLabel = document.createElement("label");
    honapLabel.textContent = "Hónap: ";
    szuroForm.appendChild(honapLabel);
    const honapSelect = document.createElement("select");
    const honapok = ["", "jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "szep", "okt", "nov", "dec"];
    for (let honap of honapok) {
        const opcio = document.createElement("option");
        opcio.value = honap;
        opcio.textContent = honap;
        honapSelect.appendChild(opcio);
    }
    szuroForm.appendChild(honapSelect);

    szuroForm.appendChild(document.createElement("br"));

    const szuroGomb = document.createElement("button");
    szuroGomb.textContent = "Szűrés";
    szuroForm.appendChild(szuroGomb);

    const oszlopSelect = document.createElement("select");
    const oszlopok = ["megnevezes", "hely", "honap", "osszeg"];
    for (let oszlop of oszlopok) {
        const opcio = document.createElement("option");
        opcio.value = oszlop;
        opcio.textContent = oszlop;
        oszlopSelect.appendChild(opcio);
    }
    filterDiv.appendChild(oszlopSelect);

    const iranySelect = document.createElement("select");
    const iranyok = ["csökkenő", "növekvő"];
    for (let irany of iranyok) {
        const opcio = document.createElement("option");
        opcio.value = irany;
        opcio.textContent = irany;
        iranySelect.appendChild(opcio);
    }
    filterDiv.appendChild(iranySelect);

    const tableDiv = document.createElement("div");
    container.appendChild(tableDiv);

    const table = document.createElement("table");
    tableDiv.appendChild(table);

    const thead = document.createElement("thead");
    table.appendChild(thead);

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    const thead_content = ["Megnevezés", "Hely", "Hónap", "Összeg"];
    for (let text of thead_content) {
        const th = document.createElement("th");
        th.textContent = text;
        tr.appendChild(th);
    }

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    callback(tbody, filterDiv, osszegDiv);

    szuroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const szurtAdatok = tomb.filter(elem => {
        if (megnevezesInput.value && !elem.megnevezes.toLowerCase().includes(megnevezesInput.value.toLowerCase())) return false;
        if (osszegInput.value && parseInt(elem.osszeg) !== parseInt(osszegInput.value)) return false;
        if (honapSelect.value && elem.honap !== honapSelect.value) return false;
        return true;
    });

    const oszlop = oszlopSelect.value;
    const irany = iranySelect.value;
    const direction = irany === "csökkenő" ? -1 : 1;

    szurtAdatok.sort((a, b) => {
        let value1 = a[oszlop];
        let value2 = b[oszlop];

        if (oszlop === "osszeg") {
            value1 = parseFloat(value1);
            value2 = parseFloat(value2);
        } else {
            value1 = value1.toString().toLowerCase();
            value2 = value2.toString().toLowerCase();
        }

        if (value1 < value2) return -1 * direction;
        if (value1 > value2) return 1 * direction;
        return 0;
    });

    tbody.innerHTML = "";
    for (let elem of szurtAdatok) {
        rowAddition(elem, tbody);
    }
});

}

function upload(tbody, container, tomb, filterDiv, osszegDiv) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileinput';
    filterDiv.appendChild(document.createElement("br"));
    filterDiv.appendChild(fileInput);

    let kiadas = 0;
    let bevetel = 0;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const Lines = reader.result.split('\n');
            const headerRemoved = Lines.slice(1);
            tomb.length = 0;
            tbody.innerHTML = "";
            kiadas = 0;
            bevetel = 0;

            for (const line of headerRemoved) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                const fields = trimmed.split(';');
                const tranzakcio = {
                    megnevezes: fields[0],
                    hely: fields[1],
                    honap: fields[2],
                    osszeg: fields[3]
                };
                tomb.push(tranzakcio);
                rowAddition(tranzakcio, tbody);

                const osszegSzam = parseInt(fields[3]);
                if (osszegSzam < 0) kiadas += osszegSzam;
                else bevetel += osszegSzam;
            }

            osszegzes(kiadas, bevetel, osszegDiv);

            const table = container.querySelector("table");
            const rows = table.querySelectorAll("tr");
            let totalCells = 0;
            rows.forEach(row => totalCells += row.cells.length);

            osszegDiv.textContent += ` | Összes cella: ${totalCells}`;
        };
        reader.readAsText(file);
    });
}

function rowAddition(obj, tbody) {
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
    const szam_osszeg = parseInt(obj.osszeg);
    if (szam_osszeg < 0) osszeg.classList.add("red");
    else osszeg.classList.add("green");
    tr.appendChild(osszeg);

    tbody.appendChild(tr);
}

function osszegzes(kiadas, bevetel, div) {
    div.innerHTML = `A teljes kiadás: ${kiadas} és a teljes bevétel: ${bevetel}`;
}
