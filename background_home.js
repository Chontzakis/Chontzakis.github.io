const canvas = document.getElementById("mlp-bg");
const ctx = canvas.getContext("2d");
let W, H;
let layers;
let nodes = [];
const edges = [];
let activeLayer = 0;
const waveSpeed = 0.02;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;

    // Adjust layers for small screens
    if (W < H) {
    layers = [4, 8, 8, 2];
    } else {
    layers = [4, 8, 10, 8, 2];
    }

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    generateNodes();
}

window.addEventListener("resize", resizeCanvas);

function generateNodes() {
  nodes.length = 0;
  edges.length = 0;

  const rotateMobile = W < H;

  if (rotateMobile) {
    // === ROTATED (vertical) layout ===
    const spacingY = H / (layers.length + 1); // vertical spacing between layers
    const maxNodes = Math.max(...layers);
    const spacingX = W / (maxNodes + 1); // horizontal spacing between nodes
    const totalWidth = spacingX * maxNodes;
    const xOffset = (W - totalWidth) / 2; // center horizontally

    for (let i = 0; i < layers.length; i++) {
      const layer = [];
      const nodesInLayer = layers[i];
      const layerWidth = spacingX * nodesInLayer;
      const layerXOffset = (W - layerWidth) / 2; // center nodes of each layer

    for (let j = 0; j < nodesInLayer; j++) {
      const x = - xOffset + layerXOffset + spacingX * (j + 1);
      const y = spacingY * (i + 1);
      layer.push({ x, y });
    }

      nodes.push(layer);
    }

  } else {
    // === NORMAL (horizontal) layout ===
    const spacingX = W / (layers.length + 1);
    for (let i = 0; i < layers.length; i++) {
      const layer = [];
      const spacingY = H / (layers[i] + 1);
      for (let j = 0; j < layers[i]; j++) {
        layer.push({ x: spacingX * (i + 1), y: spacingY * (j + 1) });
      }
      nodes.push(layer);
    }
  }

  // === Create edges ===
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let a of nodes[i]) {
      for (let b of nodes[i + 1]) {
        edges.push({ a, b, progress: 0 });
      }
    }
  }
}

let lastTime = performance.now();

function draw(time = performance.now()) {
  const delta = (time - lastTime) / 3000; // seconds since last frame
  lastTime = time;

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, W, H);

  // dim static edges
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let e of edges) {
    ctx.beginPath();
    ctx.moveTo(e.a.x, e.a.y);
    ctx.lineTo(e.b.x, e.b.y);
    ctx.stroke();
  }

  // update signal progress with time delta
  for (let e of edges) {
    if (nodes[activeLayer].includes(e.a) && nodes[activeLayer + 1].includes(e.b)) {
      e.progress += waveSpeed * delta * 60; // normalize to 60 FPS baseline
      if (e.progress > 1) e.progress = 1;

      const grad = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
      grad.addColorStop(0, "rgba(125, 249, 255,0.1)");
      grad.addColorStop(Math.max(0, e.progress - 0.1), "rgba(125, 249, 255,0.1)");
      grad.addColorStop(e.progress, "rgba(125, 249, 255,0.1)");
      grad.addColorStop(Math.min(1, e.progress + 0.1), "rgba(125, 249, 255,0)");
      grad.addColorStop(1, "rgba(0,0,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y);
      ctx.lineTo(e.b.x, e.b.y);
      ctx.stroke();
    } else {
      e.progress = 0;
    }
  }

  // light up nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let n of nodes[i]) {
      const active = i === activeLayer || i === activeLayer + 1;
      const glow = active ? 0.8 : 0.3;
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 7);
      grad.addColorStop(0, `rgba(150,150,150,${glow})`);
      grad.addColorStop(1, "rgba(150,150,150,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // advance layer when all edges complete
  const allEdgesComplete = edges
    .filter(e => nodes[activeLayer].includes(e.a) && nodes[activeLayer + 1].includes(e.b))
    .every(e => e.progress >= 1);

  if (allEdgesComplete) {
    activeLayer++;
    if (activeLayer >= nodes.length - 1) activeLayer = 0;
    for (let e of edges) e.progress = 0;
  }

  requestAnimationFrame(draw);
}

resizeCanvas();
draw();
