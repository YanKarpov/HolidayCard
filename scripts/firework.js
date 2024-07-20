// Вспомогательные функции
const PI2 = Math.PI * 2;
const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
const timestamp = () => new Date().getTime();

// Класс для создания анимации фейерверков
class Birthday {
  constructor() {
    this.resize(); // Устанавливаем начальные размеры canvas

    this.fireworks = []; // Массив для хранения фейерверков
    this.counter = 0; // Счетчик для создания новых фейерверков
  }

  resize() {
    this.width = canvas.width = window.innerWidth; // Устанавливаем ширину canvas
    let center = (this.width / 2) | 0;
    this.spawnA = (center - center / 4) | 0; // Левая граница для спавна фейерверков
    this.spawnB = (center + center / 4) | 0; // Правая граница для спавна фейерверков

    this.height = canvas.height = window.innerHeight; // Устанавливаем высоту canvas
    this.spawnC = this.height * 0.1; // Верхняя граница для спавна фейерверков
    this.spawnD = this.height * 0.5; // Нижняя граница для спавна фейерверков
  }

  onClick(evt) {
    // Получаем координаты клика
    let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
    let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

    // Создаем несколько фейерверков на месте клика
    let count = random(3, 5);
    for (let i = 0; i < count; i++)
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 360), // Полный диапазон цветов
          random(30, 110)
        )
      );

    this.counter = -1; // Сбрасываем счетчик
  }

  update(delta) {
    // Обновляем фон
    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    // Обновляем каждый фейерверк
    ctx.globalCompositeOperation = "lighter";
    for (let firework of this.fireworks) firework.update(delta);

    // Если прошло достаточно времени, создаем новый фейерверк
    this.counter += delta * 3;
    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)
        )
      );
      this.counter = 0;
    }

    // Удаляем мертвые фейерверки
    if (this.fireworks.length > 1000)
      this.fireworks = this.fireworks.filter((firework) => !firework.dead);
  }
}

// Класс для отдельного фейерверка
class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false; // Статус фейерверка
    this.offsprings = offsprings; // Количество потомков

    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;

    this.shade = shade; // Цвет фейерверка
    this.history = []; // История позиций фейерверка
  }

  update(delta) {
    if (this.dead) return; // Если фейерверк мертв, ничего не делаем

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      // Если фейерверк еще движется
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({
        x: this.x,
        y: this.y,
      });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        // Создаем потомков
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX =
            (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
          let targetY =
            (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

          birthday.fireworks.push(
            new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
          );
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) {
      // Рисуем траекторию фейерверка
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
        ctx.arc(point.x, point.y, 1.5, 0, PI2, false); // Увеличен размер точек
        ctx.fill();
      }
    } else {
      // Рисуем сам фейерверк
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
      ctx.arc(this.x, this.y, 1.5, 0, PI2, false); // Увеличен размер фейерверка
      ctx.fill();
    }
  }
}

// Получаем доступ к canvas и контексту
let canvas = document.getElementById("birthday");
let ctx = canvas.getContext("2d");

let then = timestamp(); // Сохраняем текущее время

let birthday = new Birthday();
window.onresize = () => birthday.resize(); // Обновляем размеры canvas при изменении размера окна

// Добавляем обработчик события на кнопку
document.getElementById("startButton").addEventListener("click", function () {
  const startButton = document.getElementById("startButton");
  const greeting = document.getElementById("greeting");
  const canvas = document.querySelector("canvas");

  startButton.style.opacity = 0; // Начинаем плавное исчезновение кнопки

  setTimeout(() => {
    startButton.style.display = "none"; // Скрываем кнопку после завершения анимации
    canvas.style.display = "block"; // Показываем canvas
    greeting.style.opacity = 1; // Показываем заголовок с поздравлением
  }, 2000); // Ждем 2 секунды для завершения анимации

  // Добавляем обработчики событий клика и касания
  document.onclick = (evt) => birthday.onClick(evt);
  document.ontouchstart = (evt) => birthday.onClick(evt);

  // Запускаем основной цикл анимации
  (function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    then = now;
    birthday.update(delta / 1000); // Обновляем состояние фейерверков
  })();
});
