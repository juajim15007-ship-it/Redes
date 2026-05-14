// =======================================
// SUPABASE
// =======================================

const supabaseUrl =
"https://rzcxkkztzvokiroxofjg.supabase.co/rest/v1/";

const supabaseKey =
"sb_publishable_DO65iz0TYgYZvNs0OssC4w_gcty9tri";

const supabase =
window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// =======================================
// ELEMENTOS
// =======================================

const form =
document.getElementById(
  "serviceForm"
);

const tableBody =
document.getElementById(
  "tableBody"
);

// =======================================
// CARGAR SERVICIOS
// =======================================

async function loadServices(){

  const { data, error } =
  await supabase
  .from("services")
  .select("*")
  .order("id",{
    ascending:false
  });

  if(error){

    console.error(
      "Error cargando:",
      error
    );

    return;

  }

  renderTable(data);

}

// =======================================
// GUARDAR SERVICIO
// =======================================

form.addEventListener(
"submit",
async function(e){

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

    service_date:
    document.getElementById(
      "date"
    ).value,

    ticket:
    document.getElementById(
      "ticket"
    ).value,

    entry_time:
    document.getElementById(
      "entryTime"
    ).value,

    exit_time:
    document.getElementById(
      "exitTime"
    ).value,

    service_type:
    document.getElementById(
      "serviceType"
    ).value,

    description:
    document.getElementById(
      "description"
    ).value

  };

  const { error } =
  await supabase
  .from("services")
  .insert([
    service
  ]);

  if(error){

    console.error(error);

    alert(
      "Error guardando servicio"
    );

    return;

  }

  alert(
    "Servicio guardado correctamente"
  );

  form.reset();

  clearPreviewSignature(
    "clientSignature"
  );

  clearPreviewSignature(
    "providerSignature"
  );

  loadServices();

});

// =======================================
// RENDER TABLA
// =======================================

function renderTable(services){

  tableBody.innerHTML = "";

  services.forEach(service=>{

    tableBody.innerHTML += `

      <tr>

        <td>${service.client}</td>

        <td>${service.address}</td>

        <td>${service.service_date}</td>

        <td>${service.service_type}</td>

        <td>${service.ticket}</td>

        <td>${service.entry_time}</td>

        <td>${service.exit_time}</td>

        <td>

          <div class="actions">

            <button
            class="edit-btn"
            onclick="editService(${service.id})">

              Editar

            </button>

            <button
            class="delete-btn"
            onclick="deleteService(${service.id})">

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

async function deleteService(id){

  const confirmDelete =
  confirm(
    "¿Eliminar servicio?"
  );

  if(!confirmDelete) return;

  const { error } =
  await supabase
  .from("services")
  .delete()
  .eq("id",id);

  if(error){

    console.error(error);

    return;

  }

  loadServices();

}

// =======================================
// EDITAR SERVICIO
// =======================================

async function editService(id){

  const { data, error } =
  await supabase
  .from("services")
  .select("*")
  .eq("id",id)
  .single();

  if(error){

    console.error(error);

    return;

  }

  const client =
  prompt(
    "Cliente:",
    data.client
  );

  const address =
  prompt(
    "Dirección:",
    data.address
  );

  const description =
  prompt(
    "Descripción:",
    data.description
  );

  const { error:updateError } =
  await supabase
  .from("services")
  .update({

    client,

    address,

    description

  })
  .eq("id",id);

  if(updateError){

    console.error(updateError);

    return;

  }

  loadServices();

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
// LIMPIAR MODAL
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
// LIMPIAR PREVIEW
// =======================================

function clearPreviewSignature(canvasId){

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
// GUARDAR FIRMA
// =======================================

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
// POSICION
// =======================================

function getPosition(e){

  const rect =
  modalCanvas.getBoundingClientRect();

  let x;
  let y;

  if(e.touches){

    x =
    e.touches[0].clientX - rect.left;

    y =
    e.touches[0].clientY - rect.top;

  }else{

    x =
    e.clientX - rect.left;

    y =
    e.clientY - rect.top;

  }

  return { x, y };

}

// =======================================
// INICIAR DIBUJO
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
// GENERAR PDF
// =======================================

function generatePDF(){

  const { jsPDF } =
  window.jspdf;

  const doc =
  new jsPDF();

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

  // HEADER

  doc.setFillColor(
    31,
    79,
    168
  );

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
    "TU EMPRESA",
    15,
    20
  );

  doc.setFontSize(12);

  doc.text(
    "Reporte Tecnico de Servicio",
    15,
    28
  );

  // TITULO

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

  // TABLA

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

  // FIRMAS

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

  doc.addImage(
    clientImage,
    "PNG",
    15,
    finalY + 5,
    80,
    40
  );

  doc.addImage(
    providerImage,
    "PNG",
    115,
    finalY + 5,
    80,
    40
  );

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

  // PIE

  const currentDate =
  new Date().toLocaleString();

  doc.setFontSize(10);

  doc.setTextColor(120);

  doc.text(
    "Documento generado automaticamente",
    14,
    285
  );

  doc.text(
    `Fecha: ${currentDate}`,
    14,
    291
  );

  // DESCARGA

  doc.save(
    `Servicio_${client}_${ticket}.pdf`
  );

}

// =======================================
// INICIAR
// =======================================

loadServices();