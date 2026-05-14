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
// =======================================
// GENERAR PDF PROFESIONAL
// =======================================

function generatePDF(){

  const { jsPDF } =
  window.jspdf;

  const doc =
  new jsPDF();

  // =======================================
  // DATOS
  // =======================================

  const client =
  document.getElementById(
    "clientName"
  ).value;

  const address =
  document.getElementById(
    "address"
  ).value;

  const date =
  document.getElementById(
    "date"
  ).value;

  const ticket =
  document.getElementById(
    "ticket"
  ).value;

  const entry =
  document.getElementById(
    "entryTime"
  ).value;

  const exit =
  document.getElementById(
    "exitTime"
  ).value;

  const type =
  document.getElementById(
    "serviceType"
  ).value;

  const description =
  document.getElementById(
    "description"
  ).value;

  // =======================================
  // ENCABEZADO
  // =======================================

  doc.setFillColor(31,79,168);

  doc.rect(
    0,
    0,
    220,
    35,
    "F"
  );

  doc.setTextColor(255,255,255);

  doc.setFontSize(24);

  doc.text(
    "Telecom Manager",
    15,
    20
  );

  doc.setFontSize(12);

  doc.text(
    "Copia de Servicio Tecnico",
    15,
    28
  );

  // =======================================
  // TITULO
  // =======================================

  doc.setTextColor(0,0,0);

  doc.setFontSize(18);

  doc.text(
    "Reporte de Servicio",
    14,
    50
  );

  // =======================================
  // TABLA
  // =======================================

  const tableData = [

    ["Cliente", client],

    ["Direccion", address],

    ["Fecha", date],

    ["Ticket", ticket],

    ["Hora Entrada", entry],

    ["Hora Salida", exit],

    ["Tipo Servicio", type],

    ["Descripcion", description]

  ];

  doc.autoTable({

    startY:60,

    head:[[
      "Campo",
      "Informacion"
    ]],

    body:tableData,

    styles:{
      fontSize:11
    },

    headStyles:{
      fillColor:[31,79,168]
    }

  });

  // =======================================
  // FIRMAS
  // =======================================

  const clientCanvas =
  document.getElementById(
    "clientSignature"
  );

  const providerCanvas =
  document.getElementById(
    "providerSignature"
  );

  const clientImage =
  clientCanvas.toDataURL(
    "image/png"
  );

  const providerImage =
  providerCanvas.toDataURL(
    "image/png"
  );

  const finalY =
  doc.lastAutoTable.finalY + 25;

  // CLIENTE
  doc.setFontSize(12);

  doc.text(
    "Firma Cliente",
    20,
    finalY
  );

  doc.addImage(
    clientImage,
    "PNG",
    15,
    finalY + 5,
    70,
    35
  );

  // TECNICO
  doc.text(
    "Firma Prestador",
    120,
    finalY
  );

  doc.addImage(
    providerImage,
    "PNG",
    115,
    finalY + 5,
    70,
    35
  );

  // =======================================
  // PIE DE PAGINA
  // =======================================

  const currentDate =
  new Date().toLocaleString();

  doc.setFontSize(10);

  doc.setTextColor(120);

  doc.text(
    "Documento generado automaticamente por Telecom Manager",
    14,
    285
  );

  doc.text(
    `Fecha de generacion: ${currentDate}`,
    14,
    291
  );

  // =======================================
  // DESCARGAR PDF
  // =======================================

  const fileName =
  `Servicio_${client}_${ticket}.pdf`;

  doc.save(fileName);

}
// =======================================
// MODAL FIRMA DIGITAL
// =======================================

const signatureModal =
document.getElementById(
  "signatureModal"
);

const modalCanvas =
document.getElementById(
  "modalCanvas"
);

const modalCtx =
modalCanvas.getContext("2d");

let currentTargetCanvas = null;

let drawing = false;

// AJUSTAR CANVAS
function resizeModalCanvas(){

  modalCanvas.width =
  modalCanvas.offsetWidth;

  modalCanvas.height =
  modalCanvas.offsetHeight;

}

resizeModalCanvas();

// ABRIR MODAL
function openSignatureModal(targetId){

  currentTargetCanvas =
  document.getElementById(targetId);

  signatureModal.classList.add(
    "active"
  );

  clearModalSignature();

}

// CERRAR MODAL
function closeSignatureModal(){

  signatureModal.classList.remove(
    "active"
  );

}

// LIMPIAR
function clearModalSignature(){

  modalCtx.clearRect(
    0,
    0,
    modalCanvas.width,
    modalCanvas.height
  );

}

// GUARDAR FIRMA
function saveSignature(){

  const targetCtx =
  currentTargetCanvas.getContext("2d");

  targetCtx.clearRect(
    0,
    0,
    currentTargetCanvas.width,
    currentTargetCanvas.height
  );

  targetCtx.drawImage(
    modalCanvas,
    0,
    0,
    currentTargetCanvas.width,
    currentTargetCanvas.height
  );

  closeSignatureModal();

}

// =======================================
// DIBUJO TOUCH + PC
// =======================================

function getPos(e){

  const rect =
  modalCanvas.getBoundingClientRect();

  if(e.touches){

    return {

      x:
      e.touches[0].clientX - rect.left,

      y:
      e.touches[0].clientY - rect.top

    };

  }

  return {

    x:
    e.clientX - rect.left,

    y:
    e.clientY - rect.top

  };

}

// INICIAR
function startDraw(e){

  drawing = true;

  const pos = getPos(e);

  modalCtx.beginPath();

  modalCtx.moveTo(pos.x, pos.y);

  e.preventDefault();

}

// DIBUJAR
function draw(e){

  if(!drawing) return;

  const pos = getPos(e);

  modalCtx.lineWidth = 3;

  modalCtx.lineCap = "round";

  modalCtx.strokeStyle = "#000";

  modalCtx.lineTo(pos.x, pos.y);

  modalCtx.stroke();

  e.preventDefault();

}

// FINALIZAR
function stopDraw(){

  drawing = false;

  modalCtx.beginPath();

}

// EVENTOS PC
modalCanvas.addEventListener(
  "mousedown",
  startDraw
);

modalCanvas.addEventListener(
  "mousemove",
  draw
);

modalCanvas.addEventListener(
  "mouseup",
  stopDraw
);

modalCanvas.addEventListener(
  "mouseleave",
  stopDraw
);

// EVENTOS MOVIL
modalCanvas.addEventListener(
  "touchstart",
  startDraw,
  { passive:false }
);

modalCanvas.addEventListener(
  "touchmove",
  draw,
  { passive:false }
);

modalCanvas.addEventListener(
  "touchend",
  stopDraw
);