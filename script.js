const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
let brushMode = true;
let drawing = false;
let color = colorPicker.value;
let onCanvas = false;

document.addEventListener("DOMContentLoaded", function (e) {
  if (canvas.matches(":hover")) {
    onCanvas = true;
  }
});

colorPicker.addEventListener("input", (e) => {
  color = e.target.value;
});

document.addEventListener("pointerdown", (e) => {
  if (brushMode) {
    drawing = true;
  }
});

canvas.addEventListener("pointerdown", (e) => {
  if (brushMode) {
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (onCanvas && drawing && brushMode) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("pointerenter", (e) => {
  onCanvas = true;
  if (drawing && brushMode) {
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
});

document.addEventListener("pointerup", () => {
  drawing = false;
});
canvas.addEventListener("pointercancel", () => {
  onCanvas = false;
});

function fillCanvas() {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addText() {
  let text = prompt("Enter text:");
  if (text) {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Adjust font size dynamically to fit within canvas width
    let maxWidth = canvas.width * 0.8; // Leave some margin
    let fontSize = canvas.width / (text.length * 0.6);
    fontSize = Math.min(fontSize, canvas.height);
    ctx.font = `${fontSize}px Arial`;

    let x = canvas.width / 2;

    let textMetrics = ctx.measureText(text);

    const diff = textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;

    let y = canvas.height / 2 + diff / 2;

    ctx.fillText(text, x, y, maxWidth);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function importImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function exportImage() {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
}
