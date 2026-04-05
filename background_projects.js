const canvas = document.getElementById('background-projects');
const ctx = canvas.getContext('2d');

let width, height, NUM_NODES, MAX_DISTANCE;
let currentTheme = "dark";

const colors = {
  dark: {
    nodeFill: "#ffffff",
    edgeStroke: "rgba(255, 255, 255, "
  },
  light: {
    nodeFill: "#2c3e50",
    edgeStroke: "rgba(40, 60, 90, "
  }
};

function getColors() {
  return currentTheme === "light" ? colors.light : colors.dark;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  width = window.innerWidth;
  height = window.innerHeight;

  const rotateMobile = width < height;
  if (rotateMobile) {
    NUM_NODES = 100;
    MAX_DISTANCE = width * 0.1 + height * 0.1;
  } else {
    NUM_NODES = 200;
    MAX_DISTANCE = width * 0.05 + height * 0.05;
  }

  initNodes();
}

window.addEventListener('resize', resizeCanvas);

const nodes = [];

class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5);
    this.vy = (Math.random() - 0.5);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    const col = getColors();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = col.nodeFill;
    ctx.fill();
  }
}

function initNodes() {
  nodes.length = 0;
  for (let i = 0; i < NUM_NODES; i++) nodes.push(new Node());
}

function animate() {
  // Clear to fully transparent (not black)
  ctx.clearRect(0, 0, width, height);
  
  const col = getColors();

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DISTANCE) {
        ctx.beginPath();
        const opacity = 1 - dist / MAX_DISTANCE;
        ctx.strokeStyle = col.edgeStroke + opacity + ")";
        ctx.lineWidth = 1;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach(node => {
    node.move();
    node.draw();
  });

  requestAnimationFrame(animate);
}

// Listen for theme changes (must be dispatched by script.js)
window.addEventListener('themeChanged', (e) => {
  currentTheme = e.detail.isLight ? "light" : "dark";
  // No need to reinit – colors will update on next frame
});

// Start everything
resizeCanvas();
animate();