document.addEventListener("DOMContentLoaded", function () {
  const card = document.querySelector(".card");
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");
  let animationFrameId;

  confettiCanvas.width = confettiCanvas.parentElement.offsetWidth;
  confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;

  card.addEventListener("click", function () {
    card.classList.toggle("open");
    if (card.classList.contains("open")) {
      startConfetti();
    } else {
      stopConfetti();
    }
  });

  const confetti = [];

  function createConfetti() {
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
      });
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();

      c.y += c.speed;
      c.rotation += c.speed;
      if (c.y > confettiCanvas.height) {
        c.y = -c.size;
        c.x = Math.random() * confettiCanvas.width;
      }
    });
    animationFrameId = requestAnimationFrame(drawConfetti);
  }

  function startConfetti() {
    if (confetti.length === 0) {
      createConfetti();
    }
    drawConfetti();
  }

  function stopConfetti() {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
});
