

function tablecreation(container, callback) {


    const formDiv = document.createElement("div");
    container.appendChild(formDiv);

    const form = document.createElement("form");
    formDiv.appendChild(form);

    const megnevezesLabel = document.createElement("label");
    megnevezesLabel.textContent = "Megnevezés: ";
    form.appendChild(megnevezesLabel);

    const megnevezesInput = document.createElement("input");
    form.appendChild(megnevezesInput);

    form.appendChild(document.createElement("br"));

    const osszegLabel = document.createElement("label");
    osszegLabel.textContent = "Összeg: ";
    form.appendChild(osszegLabel);

    const osszegInput = document.createElement("input");
    osszegInput.type = "number";
    form.appendChild(osszegInput);

    form.appendChild(document.createElement("br"));

    const honapLabel = document.createElement("label");
    honapLabel.textContent = "Hónap: ";
    form.appendChild(honapLabel);

    const honapSelect = document.createElement("select");
    const honapok = ["", "jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "szep", "okt", "nov", "dec"];
    for (let i = 0; i < honapok.length; i++) {
        const option = document.createElement("option");
        option.value = honapok[i];
        option.textContent = honapok[i];
        honapSelect.appendChild(option);
    }
    form.appendChild(honapSelect);

    form.appendChild(document.createElement("br"));

    const button = document.createElement("button");
    button.textContent = "Szűrés";
    form.appendChild(button);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        tbody.innerHTML = "";

        for (let i = 0; i < tomb.length; i++) {
            const elem = tomb[i];

            let Hasvalue = true;

            if (megnevezesInput.value.toLocaleLowerCase() !== "") {
                if (!elem.megnevezes.toLocaleLowerCase().includes(megnevezesInput.value.toLowerCase())) {
                    Hasvalue = false;
                }
            }

            if (osszegInput.value !== "") {
                if (parseInt(elem.osszeg) !== parseInt(osszegInput.value)) {
                    Hasvalue = false;
                }
            }

           if (honapSelect.value !== "") {
                if (elem.honap !== honapSelect.value) {
                    Hasvalue = false;
                }
}
            if(Hasvalue){
                rowAddition(elem, tbody);
            }
        }
    });

    const tableDiv = document.createElement("div");
    container.appendChild(tableDiv);
    const table = document.createElement("table");
    tableDiv.appendChild(table);
    table.id = "table"
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
}



const upload = (tbody, container) => {
    const countDiv = document.createElement("div");
    container.appendChild(countDiv);
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

