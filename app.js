// =======================================
// BASE DE DATOS TEMPORAL
// =======================================

let services = JSON.parse(
  localStorage.getItem("services")
) || [];

// =======================================
// ELEMENTOS
// =======================================

const form =
document.getElementById("serviceForm");

const tableBody =
document.getElementById("tableBody");

// =======================================
// GUARDAR SERVICIO
// =======================================

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

// =======================================
// GUARDAR LOCALSTORAGE
// =======================================

function saveServices(){

  localStorage.setItem(
    "services",
    JSON.stringify(services)
  );

}

// =======================================
// MOSTRAR TABLA
// =======================================

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

// =======================================
// ELIMINAR SERVICIO
// =======================================

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

// =======================================
// EDITAR SERVICIO
// =======================================

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

// =======================================
// MOSTRAR TABLA AL CARGAR
// =======================================

renderTable();

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

// =======================================
// AJUSTAR CANVAS
// =======================================

function resizeModalCanvas(){

  const ratio =
  window.devicePixelRatio || 1;

  const rect =
  modalCanvas.getBoundingClientRect();

  modalCanvas.width =
  rect.width * ratio;

  modalCanvas.height =
  rect.height * ratio;

  modalCtx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

  // ESTILOS
  modalCtx.lineWidth = 3;

  modalCtx.lineCap = "round";

  modalCtx.strokeStyle = "#000";

}

resizeModalCanvas();

window.addEventListener(
  "resize",
  resizeModalCanvas
);

// =======================================
// ABRIR MODAL
// =======================================

function openSignatureModal(targetId){

  currentTargetCanvas =
  document.getElementById(targetId);

  signatureModal.classList.add(
    "active"
  );

  setTimeout(()=>{

    resizeModalCanvas();

  },100);

}

// =======================================
// CERRAR MODAL
// =======================================

function closeSignatureModal(){

  signatureModal.classList.remove(
    "active"
  );

}

// =======================================
// LIMPIAR FIRMA
// =======================================

function clearModalSignature(){

  modalCtx.clearRect(
    0,
    0,
    modalCanvas.width,
    modalCanvas.height
  );

}

// =======================================
// GUARDAR FIRMA
// =======================================

function saveSignature(){

  const targetCtx =
  currentTargetCanvas.getContext("2d");

  // LIMPIAR
  targetCtx.clearRect(
    0,
    0,
    currentTargetCanvas.width,
    currentTargetCanvas.height
  );

  // DIBUJAR
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
// POSICION
// =======================================

function getPosition(e){

  const rect =
  modalCanvas.getBoundingClientRect();

  let x;
  let y;

  // TOUCH
  if(e.touches && e.touches.length > 0){

    x =
    e.touches[0].clientX - rect.left;

    y =
    e.touches[0].clientY - rect.top;

  }

  // MOUSE
  else{

    x =
    e.clientX - rect.left;

    y =
    e.clientY - rect.top;

  }

  return { x, y };

}

// =======================================
// INICIAR
// =======================================

function startDraw(e){

  drawing = true;

  const pos =
  getPosition(e);

  modalCtx.beginPath();

  modalCtx.moveTo(
    pos.x,
    pos.y
  );

  e.preventDefault();

}

// =======================================
// DIBUJAR
// =======================================

function draw(e){

  if(!drawing) return;

  const pos =
  getPosition(e);

  modalCtx.lineTo(
    pos.x,
    pos.y
  );

  modalCtx.stroke();

  e.preventDefault();

}

// =======================================
// FINALIZAR
// =======================================

function stopDraw(){

  drawing = false;

  modalCtx.beginPath();

}

// =======================================
// EVENTOS MOUSE
// =======================================

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

// =======================================
// EVENTOS TOUCH
// =======================================

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

modalCanvas.addEventListener(
  "touchcancel",
  stopDraw
);

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

  doc.setTextColor(
    255,
    255,
    255
  );

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

  doc.setTextColor(
    0,
    0,
    0
  );

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
  doc.lastAutoTable.finalY + 30;

  // TITULOS
  doc.setFontSize(12);

  doc.text(
    "Firma Cliente",
    25,
    finalY
  );

  doc.text(
    "Firma Tecnico",
    125,
    finalY
  );

  // IMAGEN CLIENTE
  doc.addImage(
    clientImage,
    "PNG",
    15,
    finalY + 5,
    80,
    40
  );

  // IMAGEN TECNICO
  doc.addImage(
    providerImage,
    "PNG",
    115,
    finalY + 5,
    80,
    40
  );

  // LINEAS
  doc.line(
    15,
    finalY + 48,
    95,
    finalY + 48
  );

  doc.line(
    115,
    finalY + 48,
    195,
    finalY + 48
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