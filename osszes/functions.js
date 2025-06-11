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

const szurtAdatok = [];

for (let i = 0; i < tomb.length; i++) {
    const elem = tomb[i];
const megnevezesSzoveg = megnevezesInput.value.toLowerCase();
const megnevezesElem = elem.megnevezes.toLowerCase();
let megnevezesRendben = false;
if (megnevezesSzoveg === "") {
    megnevezesRendben = true;
} else if (megnevezesElem.includes(megnevezesSzoveg)) {
    megnevezesRendben = true;
} else {
    megnevezesRendben = false;
}

let osszegRendben = false;
if (osszegInput.value === "") {
    osszegRendben = true;
} else {
    const szurtOsszeg = parseInt(osszegInput.value);
    const elemOsszeg = parseInt(elem.osszeg);
    if (elemOsszeg === szurtOsszeg) {
        osszegRendben = true;
    } else {
        osszegRendben = false;
    }
}

let honapRendben = false;
if (honapSelect.value === "") {
    honapRendben = true;
} else if (elem.honap === honapSelect.value) {
    honapRendben = true;
} else {
    honapRendben = false;
}


    if (megnevezesRendben && osszegRendben && honapRendben) {
        szurtAdatok.push(elem);
    }
}


   let irany;
if (iranySelect.value === "csökkenő") {
    irany = -1;
} else {
    irany = 1;
}

const oszlop = oszlopSelect.value;

for (let i = 0; i < szurtAdatok.length - 1; i++) {
    for (let j = 0; j < szurtAdatok.length - 1 - i; j++) {
        let a = szurtAdatok[j][oszlop];
        let b = szurtAdatok[j + 1][oszlop];

        if (oszlop === "osszeg") {
            a = parseFloat(a);
            b = parseFloat(b);
        } else {
            a = a.toString().toLowerCase();
            b = b.toString().toLowerCase();
        }

        if ((irany === 1 && a > b) || (irany === -1 && a < b)) {
            const temp = szurtAdatok[j];
            szurtAdatok[j] = szurtAdatok[j + 1];
            szurtAdatok[j + 1] = temp;
        }
    }
}

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
for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cellCount = row.cells.length;
    totalCells = totalCells + cellCount;
}


            osszegDiv.textContent += ` | Összes elem: ${totalCells}`;
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
