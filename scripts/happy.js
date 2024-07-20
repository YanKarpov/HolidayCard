const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Star {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -this.radius;
      this.x = random(0, canvas.width);
    }
    this.draw();
  }
}

function init() {
  for (let i = 0; i < 100; i++) {
    const x = random(0, canvas.width);
    const y = random(0, canvas.height);
    const radius = random(1, 3);
    const speed = random(0.5, 2);
    stars.push(new Star(x, y, radius, speed));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => star.update());
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars.length = 0;
  init();
});
