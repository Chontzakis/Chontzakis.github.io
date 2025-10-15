const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  // Handle device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  ctx.scale(dpr, dpr);

  width = window.innerWidth;
  height = window.innerHeight;

  // Recalculate distances and node count for mobile
  const rotateMobile = width < 500;
  if (rotateMobile) {
    NUM_NODES = 100;
    MAX_DISTANCE = width * 0.1 + height * 0.1;
  } else {
    NUM_NODES = 200;
    MAX_DISTANCE = width * 0.05 + height * 0.05;
  }
}

let width, height, NUM_NODES, MAX_DISTANCE;
resizeCanvas();
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
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

// Initialize nodes
function initNodes() {
  nodes.length = 0;
  for (let i = 0; i < NUM_NODES; i++) nodes.push(new Node());
}
initNodes();

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DISTANCE) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / MAX_DISTANCE})`;
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

animate();
