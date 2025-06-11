function tablecreation(container, callback) {
const filterDiv = document.createElement("div");
    container.appendChild(filterDiv);

    const tableDiv = document.createElement("div");
    container.appendChild(tableDiv);

    const oszlopSelect = document.createElement("select");
    const oszlopok = ["megnevezes", "hely", "honap", "osszeg"];
    for (let i = 0; i < oszlopok.length; i++) {
        const opcio = document.createElement("option");
        opcio.value = oszlopok[i];
        opcio.textContent = oszlopok[i];
        oszlopSelect.appendChild(opcio);
    }
    filterDiv.appendChild(oszlopSelect);

    const iranySelect = document.createElement("select");
    const iranyok = ["csökkenő", "növekvő"];
    for (let i = 0; i < iranyok.length; i++) {
        const opcio = document.createElement("option");
        opcio.value = iranyok[i];
        opcio.textContent = iranyok[i];
        iranySelect.appendChild(opcio);
    }
    filterDiv.appendChild(iranySelect);

    const gomb = document.createElement("button");
    gomb.textContent = "Rendezés";
    filterDiv.appendChild(gomb);

    const table = document.createElement("table");
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

    callback(tbody);

    gomb.addEventListener("click", () => {
        const oszlop = oszlopSelect.value;
        const irany = iranySelect.value;

        let rendezett = false;

while (!rendezett) {
    rendezett = true;

    for (let i = 0; i < tomb.length - 1; i++) {
        const aktualis = tomb[i];
        const kovetkezo = tomb[i + 1];

        let ertek1 = aktualis[oszlop];
        let ertek2 = kovetkezo[oszlop];

        if (oszlop === "osszeg") {
            ertek1 = parseInt(ertek1);
            ertek2 = parseInt(ertek2);
        } else {
            ertek1 = ertek1.toString().toLowerCase();
            ertek2 = ertek2.toString().toLowerCase();
        }

        let kellCsere = false;

        if (irany === "növekvő" && ertek1 > ertek2) {
            kellCsere = true;
        }

        if (irany === "csökkenő" && ertek1 < ertek2) {
            kellCsere = true;
        }

        if (kellCsere) {
            const ideiglenes = tomb[i];
            tomb[i] = tomb[i + 1];
            tomb[i + 1] = ideiglenes;
            rendezett = false; 
        }
    }
}


        tbody.innerHTML = "";
        for (let i = 0; i < tomb.length; i++) {
            rowAddition(tomb[i], tbody);
        }
    });
}

const upload = (tbody, container) => {

    const fileInput = document.createElement('input')
    container.appendChild(fileInput);
    fileInput.id='fileinput'
    fileInput.type = 'file';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
           const Lines = reader.result.split('\n')
           const headerRemoved = Lines.slice(1);
           for(const line of headerRemoved){
                const trimmed = line.trim();
                const fields = trimmed.split(';');
                const tranzakcio = {
                    megnevezes: fields[0],
                    hely: fields[1],
                    honap: fields[2],
                    osszeg: fields[3]
                }
                tomb.push(tranzakcio);
                rowAddition(tranzakcio, tbody);
           }
        }
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


