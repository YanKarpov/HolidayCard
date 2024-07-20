// Получаем ссылки на canvas и контекст для рисования 2D
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Получаем ссылки на элементы intro, menu и кнопку для задувания свечей
const intro = document.getElementById("intro");
const menu = document.getElementById("menu");
const blowCandlesButton = document.getElementById("blowCandlesButton");

// Массив для хранения объектов шариков
let balloons = [];

const popSound = new Audio('/sounds/balloon-pop.mp3'); 

/**
 * Конструктор для объекта Balloon (Шарик)
 * @param {number} x - Координата x шарика
 * @param {number} y - Координата y шарика
 * @param {number} radius - Радиус шарика
 * @param {string} color - Цвет шарика
 */
function Balloon(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dy = Math.random() * 2 + 1; // Случайная вертикальная скорость
  this.popped = false; // Добавляем флаг для состояния лопнутого шарика
}

/**
 * Рисуем шарик на canvas
 */
Balloon.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.closePath();
};

/**
 * Обновляем положение шарика и перерисовываем его
 */
Balloon.prototype.update = function () {
  this.y -= this.dy; // Двигаем шарик вверх
  // Сбрасываем положение, если шарик вышел за верхнюю границу canvas
  if (this.y + this.radius < 0) {
    this.y = canvas.height + this.radius;
  }
  this.draw(); // Перерисовываем шарик
};

/**
 * Инициализируем шарики с случайными положениями, размерами и цветами
 * @param {number} numBalloons - Количество создаваемых шариков
 */
function initBalloons(numBalloons) {
  balloons = [];
  for (let i = 0; i < numBalloons; i++) {
    let radius = Math.random() * 20 + 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * canvas.height;
    let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    balloons.push(new Balloon(x, y, radius, color));
  }
}

/**
 * Анимируем шарики, постоянно обновляя и перерисовывая их
 */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let allPopped = true;
  balloons.forEach((balloon) => {
    if (!balloon.popped) {
      allPopped = false;
      balloon.update();
    }
  });
  if (allPopped) {
    blowCandlesButton.style.display = 'block'; // Показать кнопку "Задуть свечи"
    setTimeout(() => {
      blowCandlesButton.style.opacity = 1; // Плавное появление
    }, 0); // Устанавливаем таймаут для плавного появления
  } else {
    requestAnimationFrame(animate);
  }
}

/**
 * Обработчик для клика по canvas для лопания шариков
 */
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  balloons.forEach((balloon) => {
    const distance = Math.sqrt((x - balloon.x) ** 2 + (y - balloon.y) ** 2);
    if (distance < balloon.radius && !balloon.popped) {
      balloon.popped = true; // Помечаем шарик как лопнутый
      popSound.play(); // Проигрываем звук лопания
    }
  });
});

/**
 * Изменяем размер canvas под размер окна и переинициализируем шарики
 */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initBalloons(30); // Переинициализация с 30 шариками
}

/**
 * Отображаем вступительные тексты с эффектом плавного появления и исчезновения
 * @param {string[]} texts - Массив текстов для отображения
 */
function displayIntro(texts) {
  let index = 0;

  function showNextText() {
    if (index < texts.length) {
      intro.textContent = texts[index];
      intro.style.opacity = 1;

      setTimeout(() => {
        intro.style.opacity = 0;
        setTimeout(showNextText, 1000); // Задержка перед следующим текстом
      }, 2500); // Время показа каждого текста
      index++;
    } else {
      // Конец вступления, отображаем canvas и меню
      intro.style.display = "none";
      canvas.style.display = "block";
      menu.style.display = "block";
      menu.style.opacity = 1;
      menu.style.transform = "translate(-50%, -50%) scale(1)";
      resizeCanvas();
      animate();
    }
  }

  showNextText();
}

/**
 * Получаем вступительные тексты из JSON файла и отображаем их
 */
function fetchIntroduction() {
  fetch("welcome.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const texts = Object.values(data);
      displayIntro(texts);
    })
    .catch((error) => console.error("Ошибка при получении вступления:", error));
}

// Регулируем размер canvas при изменении размера окна
window.addEventListener("resize", resizeCanvas);

// Показываем вступление или сразу canvas и меню на основе session storage
if (!sessionStorage.getItem("introShown")) {
  fetchIntroduction();
  sessionStorage.setItem("introShown", "true");
} else {
  intro.style.display = "none";
  canvas.style.display = "block";
  menu.style.display = "block";
  menu.style.opacity = 1;
  menu.style.transform = "translate(-50%, -50%) scale(1)";
  resizeCanvas();
  animate();
}



