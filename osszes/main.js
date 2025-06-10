const tomb = [];

const container = document.createElement("div");
document.body.appendChild(container);

tableAndFormCreation(container, (tbody, filterDiv, osszegDiv) => {
    upload(tbody, container, tomb, filterDiv, osszegDiv);
});
