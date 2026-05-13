// BASE DE DATOS TEMPORAL
let services = JSON.parse(
  localStorage.getItem("services")
) || [];

// ELEMENTOS
const form =
document.getElementById("serviceForm");

const tableBody =
document.getElementById("tableBody");

// GUARDAR SERVICIO
form.addEventListener(
"submit",
function(e){

  e.preventDefault();

  const service = {

    client:
    document.getElementById(
      "clientName"
    ).value,

    address:
    document.getElementById(
      "address"
    ).value,

    date:
    document.getElementById(
      "date"
    ).value,

    ticket:
    document.getElementById(
      "ticket"
    ).value,

    entry:
    document.getElementById(
      "entryTime"
    ).value,

    exit:
    document.getElementById(
      "exitTime"
    ).value,

    type:
    document.getElementById(
      "serviceType"
    ).value,

    description:
    document.getElementById(
      "description"
    ).value

  };

  services.push(service);

  saveServices();

  renderTable();

  form.reset();

});

// GUARDAR LOCALSTORAGE
function saveServices(){

  localStorage.setItem(
    "services",
    JSON.stringify(services)
  );

}

// RENDER TABLA
function renderTable(){

  tableBody.innerHTML = "";

  services.forEach((service,index)=>{

    tableBody.innerHTML += `

      <tr>

        <td>${service.client}</td>
        <td>${service.address}</td>
        <td>${service.date}</td>
        <td>${service.type}</td>
        <td>${service.ticket}</td>
        <td>${service.entry}</td>
        <td>${service.exit}</td>

        <td>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editService(${index})">

                    Editar

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteService(${index})">

                    Eliminar

                </button>

            </div>

        </td>

      </tr>

    `;

  });

}

// ELIMINAR
function deleteService(index){

  const confirmDelete =
  confirm(
    "¿Eliminar servicio?"
  );

  if(confirmDelete){

    services.splice(index,1);

    saveServices();

    renderTable();

  }

}

// EDITAR
function editService(index){

  const service =
  services[index];

  service.client =
  prompt(
    "Cliente:",
    service.client
  );

  service.address =
  prompt(
    "Dirección:",
    service.address
  );

  service.date =
  prompt(
    "Fecha:",
    service.date
  );

  service.ticket =
  prompt(
    "Ticket:",
    service.ticket
  );

  service.entry =
  prompt(
    "Hora entrada:",
    service.entry
  );

  service.exit =
  prompt(
    "Hora salida:",
    service.exit
  );

  service.type =
  prompt(
    "Tipo:",
    service.type
  );

  service.description =
  prompt(
    "Descripción:",
    service.description
  );

  saveServices();

  renderTable();

}

// MOSTRAR TABLA
renderTable();

// FIRMAS
function setupCanvas(canvasId){

  const canvas =
  document.getElementById(canvasId);

  const ctx =
  canvas.getContext("2d");

  let drawing = false;

  canvas.addEventListener(
  "mousedown",
  ()=>{
    drawing = true;
  });

  canvas.addEventListener(
  "mouseup",
  ()=>{
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener(
  "mousemove",
  draw
  );

  function draw(e){

    if(!drawing) return;

    const rect =
    canvas.getBoundingClientRect();

    ctx.lineWidth = 2;

    ctx.lineCap = "round";

    ctx.strokeStyle = "#000";

    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

  }

}

setupCanvas("clientSignature");

setupCanvas("providerSignature");

// LIMPIAR CANVAS
function clearCanvas(canvasId){

  const canvas =
  document.getElementById(canvasId);

  const ctx =
  canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}

// GENERAR PDF
function generatePDF(){

  const { jsPDF } =
  window.jspdf;

  const doc =
  new jsPDF();

  doc.text(
    "Reporte Servicio Técnico",
    20,
    20
  );

  const data = [

    [
      "Cliente",
      document.getElementById(
        "clientName"
      ).value
    ],

    [
      "Dirección",
      document.getElementById(
        "address"
      ).value
    ],

    [
      "Fecha",
      document.getElementById(
        "date"
      ).value
    ],

    [
      "Ticket",
      document.getElementById(
        "ticket"
      ).value
    ],

    [
      "Hora Entrada",
      document.getElementById(
        "entryTime"
      ).value
    ],

    [
      "Hora Salida",
      document.getElementById(
        "exitTime"
      ).value
    ],

    [
      "Tipo",
      document.getElementById(
        "serviceType"
      ).value
    ],

    [
      "Descripción",
      document.getElementById(
        "description"
      ).value
    ]

  ];

  doc.autoTable({

    startY:30,

    head:[[
      "Campo",
      "Información"
    ]],

    body:data

  });

  doc.save(
    "reporte-servicio.pdf"
  );

}