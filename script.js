const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let tool = "brush";
let drawing = false;
let color = document.getElementById("colorPicker").value;

document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

function setTool(selectedTool) {
  tool = selectedTool;
}

canvas.addEventListener("mousedown", (e) => {
  if (tool === "brush") {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  } else if (tool === "bucket") {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (tool === "text") {
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
});

canvas.addEventListener("mousemove", (e) => {
  if (drawing && tool === "brush") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

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
