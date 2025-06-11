const osszegzesDiv = document.createElement('div');
osszegzesDiv.id = "osszegzes";

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
    div.appendChild(osszegzesDiv);
}
const osszegzes = (kiadas, bevetel) =>{
     osszegzesDiv.innerHTML = `A teljes kiadás: ${kiadas} és a teljes bevétel: ${bevetel}`;
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
           const lines = reader.result.split('\n')
           const headerRemoved = lines.slice(1);

           let kiadas = 0;
           let bevetel = 0;

          for(const line of headerRemoved){
            const trimmed = line.trim();
            const fields = trimmed.split(';');
            const osszegSzam = parseInt(fields[3]);

            if (osszegSzam < 0) {
                kiadas += osszegSzam;
            } else {
                bevetel += osszegSzam;
            }

            const tranzakcio = {
                megnevezes: fields[0],
                hely: fields[1],
                honap: fields[2],
                osszeg: fields[3]
            }
            tomb.push(tranzakcio);
            rowAddition(tranzakcio, tbody);
        }
            osszegzes(kiadas, bevetel);
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