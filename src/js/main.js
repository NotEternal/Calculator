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
    // проверять на наличие запрещенных символов (unicode)
    // получить значение поля и разбить на массив символов
    // проверить наличие ошибок в операторах
    // разбить массив на отдельные операции по приоритету
    // выполнить каждую операцию в зависимости от приоритета
    // записывать результат каждой операции в result
    return this.result;
  },

  showError() {
    this.error.removeAttribute("hidden");
  },

  hideError() {
    this.error.setAttribute("hidden", "");
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
        viewResult();
        break;
    }
  }
});

calculator.input.addEventListener("input", () => {
  calculator.hideError();
});

calculator.input.addEventListener("keydown", (event) => {
  if (event.code === "Backspace") {
    calculator.delete();
    // предотвращает второй вызов delete(),
    // который происходит при всплытии
    event.preventDefault();
  } else if (event.code === "Enter") {
    viewResult();
  } else if (!checkCorrectCode(event.key)) {
    event.preventDefault();
  }
});

function viewResult() {
  const result = calculator.getResult();

  if (result) {
    const li = document.createElement("li");
    li.innerHTML = result;

    calculator.input.value = result;
    document.querySelector(".history__list").append(li);
  } else {
    calculator.showError();
  }
}

function checkCorrectCode(key) {
  return (
    (key >= "0" && key <= "9") ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "%" ||
    key === "(" ||
    key === ")" ||
    key === "."
  );
}
