const tomb = [];

const container = document.createElement("container");
document.body.appendChild(container);
tablecreation(container, (tbody) =>{
    upload(tbody, container, tomb);
})