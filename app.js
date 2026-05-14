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

// =======================================
// FIRMA DIGITAL COMPATIBLE MOVIL + PC
// =======================================

function setupCanvas(canvasId){

  const canvas =
  document.getElementById(canvasId);

  const ctx =
  canvas.getContext("2d");

  let drawing = false;

  // AJUSTAR RESOLUCION
  function resizeCanvas(){

    const ratio =
    window.devicePixelRatio || 1;

    canvas.width =
    canvas.offsetWidth * ratio;

    canvas.height =
    canvas.offsetHeight * ratio;

    ctx.scale(ratio, ratio);

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

  }

  resizeCanvas();

  // OBTENER POSICION
  function getPosition(e){

    const rect =
    canvas.getBoundingClientRect();

    // TOUCH
    if(e.touches){

      return {

        x:
        e.touches[0].clientX - rect.left,

        y:
        e.touches[0].clientY - rect.top

      };

    }

    // MOUSE
    return {

      x:
      e.clientX - rect.left,

      y:
      e.clientY - rect.top

    };

  }

  // INICIAR
  function start(e){

    drawing = true;

    const pos =
    getPosition(e);

    ctx.beginPath();

    ctx.moveTo(pos.x, pos.y);

    e.preventDefault();

  }

  // DIBUJAR
  function draw(e){

    if(!drawing) return;

    const pos =
    getPosition(e);

    ctx.lineTo(pos.x, pos.y);

    ctx.stroke();

    e.preventDefault();

  }

  // FINALIZAR
  function stop(){

    drawing = false;

    ctx.beginPath();

  }

  // =======================================
  // EVENTOS PC
  // =======================================

  canvas.addEventListener(
    "mousedown",
    start
  );

  canvas.addEventListener(
    "mousemove",
    draw
  );

  canvas.addEventListener(
    "mouseup",
    stop
  );

  canvas.addEventListener(
    "mouseleave",
    stop
  );

  // =======================================
  // EVENTOS MOVIL
  // =======================================

  canvas.addEventListener(
    "touchstart",
    start,
    { passive:false }
  );

  canvas.addEventListener(
    "touchmove",
    draw,
    { passive:false }
  );

  canvas.addEventListener(
    "touchend",
    stop
  );

}

// ACTIVAR FIRMAS
setupCanvas("clientSignature");
setupCanvas("providerSignature");

// =======================================
// LIMPIAR FIRMA
// =======================================

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