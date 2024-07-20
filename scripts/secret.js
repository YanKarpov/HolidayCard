document.addEventListener("DOMContentLoaded", function () {
  fetch("../secret.json")
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then((messages) => {
          displayMessages(messages);
      })
      .catch((error) => console.error("Ошибка загрузки JSON:", error));

  function displayMessages(messages) {
      const keys = Object.keys(messages);
      let index = 0;

      function showNextMessage() {
          if (index < keys.length) {
              const messageKey = keys[index];
              typeMessage(document.getElementById("message"), messages[messageKey]);
              index++;

              // Остановка на фразе "click_candle"
              if (messageKey === "click_candle") {
                  clearInterval(interval);
                  makeCandlesClickable();
              }
          } else {
              clearInterval(interval);
          }
      }

      const interval = setInterval(showNextMessage, 5000); // Интервал между сообщениями (в миллисекундах)

      function typeMessage(element, message) {
          let i = 0;
          element.textContent = ""; // Очистить предыдущее сообщение
          function type() {
              if (i < message.length) {
                  element.textContent += message.charAt(i);
                  i++;
                  setTimeout(type, 50); // Скорость печатания (в миллисекундах)
              }
          }
          type();
      }

      function makeCandlesClickable() {
          const candles = document.querySelectorAll(".flame");
          candles.forEach((candle) => {
              candle.style.cursor = "pointer";
              candle.addEventListener("click", () => {
                  candles.forEach((c) => (c.style.visibility = "hidden")); // Потушить все свечи
                  continueMessages();
              });
          });
      }

      function continueMessages() {
          const newKeys = keys.slice(index); // Получить оставшиеся ключи
          newKeys.forEach((key, i) => {
              setTimeout(() => {
                  typeMessage(document.getElementById("message"), messages[key]);
              }, i * 5000);
          });
      }
  }
});


