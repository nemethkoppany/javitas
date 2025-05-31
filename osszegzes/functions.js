const tablecreation = (container, callback) =>{
    const div = document.createElement("div");
    container.appendChild(div);

    const table = document.createElement("table");
    div.appendChild(table);

    const thead = document.createElement("thead");
    table.appendChild(thead);

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    const headerContent = ["Megnevezés","Hely", "Hónap", "Összeg"]
    for(const content of headerContent){
        const th = document.createElement("th");
        th.innerText = content;
        tr.appendChild(th);
    }

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    callback(tbody);
}

const upload = (tbody, container, ) => {
    const fileInput = document.createElement('input')
    container.appendChild(fileInput);
    fileInput.id='fileinput'
    fileInput.type = 'file';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
           const lines = reader.result.split('\n')
           const headerRemoved = lines.slice(1);
           for(const line of headerRemoved){
                const trimmed = line.trim();
                const fields = trimmed.split(';');
                const alkotas = {
                    megnevezes: fields[0],
                    hely: fields[1],
                    honap: fields[2],
                    osszeg: fields[3]
                }
                tomb.push(alkotas);
                rowAddition(alkotas, tbody);

            }
        }
        reader.readAsText(file);
    })
}

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

   const szam_osszeg = Number(parseInt(obj.osszeg));

    if (szam_osszeg < 0) {
        osszeg.classList.add("red");
    } else {
        osszeg.classList.add("green");
    }


    tr.appendChild(osszeg);
    tbody.appendChild(tr);
}