const canvas = document.getElementById("background-home");
const ctx = canvas.getContext("2d");
let W, H;
let layers;
let nodes = [];
const edges = [];
let activeLayer = 0;
const waveSpeed = 0.02;
let currentTheme = "dark"; // 'dark' or 'light'

// Theme‑dependent color palettes
const colors = {
  dark: {
    bgFill: "rgba(0,0,0,0.3)",
    edgeStatic: "rgba(255,255,255,0.05)",
    signalStart: "rgba(125, 249, 255,0.1)",
    signalMid: "rgba(125, 249, 255,0.1)",
    signalEnd: "rgba(0,0,255,0)",
    nodeGlowActive: 0.8,
    nodeGlowInactive: 0.3,
    nodeColorStart: "rgba(150,150,150,",
    nodeColorEnd: "rgba(150,150,150,0)"
  },
  light: {
    bgFill: "rgba(240, 242, 245, 0.5)",     // light transparent fill
    edgeStatic: "rgba(80, 80, 120, 0.15)",
    signalStart: "rgba(0, 100, 200, 0.25)",
    signalMid: "rgba(0, 150, 255, 0.35)",
    signalEnd: "rgba(100, 150, 255, 0)",
    nodeGlowActive: 0.9,
    nodeGlowInactive: 0.4,
    nodeColorStart: "rgba(40, 80, 140,",
    nodeColorEnd: "rgba(40, 80, 140,0)"
  }
};

function getColors() {
  return currentTheme === "light" ? colors.light : colors.dark;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;

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
    const spacingY = H / (layers.length + 1);
    const maxNodes = Math.max(...layers);
    const spacingX = W / (maxNodes + 1);
    const totalWidth = spacingX * maxNodes;
    const xOffset = (W - totalWidth) / 2;

    for (let i = 0; i < layers.length; i++) {
      const layer = [];
      const nodesInLayer = layers[i];
      const layerWidth = spacingX * nodesInLayer;
      const layerXOffset = (W - layerWidth) / 2;
      for (let j = 0; j < nodesInLayer; j++) {
        const x = -xOffset + layerXOffset + spacingX * (j + 1);
        const y = spacingY * (i + 1);
        layer.push({ x, y });
      }
      nodes.push(layer);
    }
  } else {
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
  const delta = (time - lastTime) / 3000;
  lastTime = time;
  const col = getColors();

  // Background fill (transparent to let body background show, but we fill to blend)
  ctx.fillStyle = col.bgFill;
  ctx.fillRect(0, 0, W, H);

  // Static edges
  ctx.strokeStyle = col.edgeStatic;
  ctx.lineWidth = 1;
  for (let e of edges) {
    ctx.beginPath();
    ctx.moveTo(e.a.x, e.a.y);
    ctx.lineTo(e.b.x, e.b.y);
    ctx.stroke();
  }

  // Update and draw active signal edges
  for (let e of edges) {
    if (nodes[activeLayer] && nodes[activeLayer + 1] &&
        nodes[activeLayer].includes(e.a) && nodes[activeLayer + 1].includes(e.b)) {
      e.progress += waveSpeed * delta * 60;
      if (e.progress > 1) e.progress = 1;

      const grad = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
      grad.addColorStop(0, col.signalStart);
      grad.addColorStop(Math.max(0, e.progress - 0.1), col.signalMid);
      grad.addColorStop(e.progress, col.signalMid);
      grad.addColorStop(Math.min(1, e.progress + 0.1), "rgba(125,249,255,0)"); // fade tail
      grad.addColorStop(1, col.signalEnd);

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

  // Draw nodes with glow
  for (let i = 0; i < nodes.length; i++) {
    for (let n of nodes[i]) {
      const active = i === activeLayer || i === activeLayer + 1;
      const glow = active ? col.nodeGlowActive : col.nodeGlowInactive;
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 7);
      grad.addColorStop(0, `${col.nodeColorStart}${glow})`);
      grad.addColorStop(1, col.nodeColorEnd);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Advance layer when all edges complete
  if (activeLayer < nodes.length - 1) {
    const activeEdges = edges.filter(e =>
      nodes[activeLayer].includes(e.a) && nodes[activeLayer + 1].includes(e.b)
    );
    if (activeEdges.length > 0 && activeEdges.every(e => e.progress >= 1)) {
      activeLayer++;
      if (activeLayer >= nodes.length - 1) activeLayer = 0;
      for (let e of edges) e.progress = 0;
    }
  }

  requestAnimationFrame(draw);
}

// Listen for theme changes from script.js
window.addEventListener('themeChanged', (e) => {
  currentTheme = e.detail.isLight ? "light" : "dark";
  // No need to regenerate nodes, just redraw will use new colors.
  // But to clear lingering old gradients we can force a small redraw.
  // The next frame will pick up new colors automatically.
});

resizeCanvas();
draw();