"use strict";

const calculator = {
  calc: document.querySelector(".calc"),
  input: document.querySelector(".calc__input"),
  error: document.querySelector(".calc__error"),
  result: 0,

  delete() {
    if (this.input.value != "") {
      const resStr = this.input.value.split("");

      resStr.pop();
      this.input.value = resStr.join("");
    }
  },

  clear() {
    this.input.value = "";
  },

  getResult() {
    // проверять на наличие запрещенных символов
    // получить значение поля и разбить на массив символов
    // проверить наличие ошибок в операторах
    // разбить массив на отдельные операции по приоритету
    // выполнить каждую операцию в зависимости от приоритета
    // записывать результат каждой операции в result
    return this.result;
  },
};

calculator.calc.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    switch (event.target.className) {
      case "":
        calculator.input.value += event.target.textContent;
        break;

      case "btn-delete":
        calculator.delete();
        break;

      case "btn-clear":
        calculator.clear();
        break;

      case "btn-result":
        // TODO: вынести в отдельную функцию
        const result = calculator.getResult();

        if (result) {
          const li = (document.createElement("li").innerHTML = result);

          calculator.input.value = result;
          document.querySelector(".history__list").append(li);
        } else {
          // view error
        }
        // TODO:
        break;
    }
  }
});
