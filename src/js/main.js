'use strict';

const calculator = {
  calc: document.querySelector('.calc'),
  input: document.querySelector('.calc__input'),
  error: document.querySelector('.calc__error'),
  result: 0,

  delete() {
    if (this.input.value != '') {
      const resStr = this.input.value.split('');

      resStr.pop();
      this.input.value = resStr.join('');
      this.hideError();
    }
  },

  clear() {
    if (this.input.value != '') {
      this.input.value = '';
      this.hideError();
    }
  },

  getResult() {
    this.result = 0;

    if (this.input.value != '') {
      const arrSimbols = this.input.value.split('');

      if (checkCorrectSimbols(arrSimbols)) {
        this.result = expression(arrSimbols);
      }
    }

    return this.result;
  },

  showError() {
    this.error.removeAttribute('hidden');
  },

  hideError() {
    this.error.setAttribute('hidden', '');
  },
};

function checkCorrectSimbols(arrSimb) {
  if (
    checkErrSimbolsInStartAndEnd(arrSimb) &&
    checkTwoNoDigitSimbols(arrSimb) &&
    checkBrackets(arrSimb)
  ) {
    return true;
  }

  return false;
}

// ! CHANGE NAME FUNCTION
function checkErrSimbolsInStartAndEnd(arr) {
  // ! CHANGE SIMBOL OPERATORS
  const arrStartSimbErr = ['%', '*', '/', '-', ')', 'x2'];
  const arrEndSimbErr = ['%', '*', '/', '-', '+', 'cor', '('];

  if (
    arrStartSimbErr.includes(arr[0]) ||
    arrEndSimbErr.includes(arr[arr.length - 1])
  ) {
    return false;
  }

  return true;
}

// ! CHANGE NAME FUNCTION
function checkTwoNoDigitSimbols(arr) {
  // запрет на идущие подряд операторы
  // ! CHANGE SIMBOL OPERATORS
  const arrErrSimbols = ['*', '/', '-', '+', '%', 'cor', 'x2'];

  for (let i = 0; i < arr.length - 2; i += 1) {
    if (arrErrSimbols.includes(arr[i]) && arrErrSimbols.includes(arr[i + 1])) {
      return false;
    }
  }

  return true;
}

function checkBrackets(arr) {
  const arrBrackets = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === '(' || arr[i] === ')') {
      arrBrackets.push(arr[i]);
    }
  }
  // не четное кол-во скобок
  if (arrBrackets.length % 2 != 0) {
    return false;
  }

  const arrOpenBrakets = arrBrackets.slice(0, arrBrackets.length / 2);
  const arrCloseBrakets = arrBrackets.slice(
    arrBrackets.length / 2,
    arrBrackets.length
  );
  // не правильная последовательность скобок
  if (arrOpenBrakets.includes(')') || arrCloseBrakets.includes('(')) {
    return false;
  }

  return true;
}
// TODO: save work
function expression(arr) {
  // * базовый случай, когда в массиве только один элемент
  if (arr.length === 1) {
    return arr[0];
  }

  // * если в массиве есть скобки то вызываем её для скобок
  // * или вычисляем текущее выражение по приоритету
  if (arr.includes('(')) {
    // вычислить скобки
  } else {
    // вычислить одну приоритетную операцию
    // return вычисленная операция + expression(новый массив без операции)
  }
}

// EVENTS AND SANDLERS ------------------------------

calculator.calc.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    switch (event.target.className) {
      case '':
        calculator.input.value += event.target.textContent;
        break;

      case 'btn-delete':
        calculator.delete();
        break;

      case 'btn-clear':
        calculator.clear();
        break;

      case 'btn-result':
        viewResult();
        break;
    }
  }
});

calculator.input.addEventListener('input', () => {
  calculator.hideError();
});

calculator.input.addEventListener('keydown', (event) => {
  if (
    event.code === 'Backspace' ||
    event.code === 'ArrowLeft' ||
    event.code === 'ArrowRight'
  ) {
    return;
  } else if (event.code === 'Enter') {
    viewResult();
  } else if (!checkCorrectCode(event.key)) {
    event.preventDefault();
  }
});

function viewResult() {
  const result = calculator.getResult();

  if (result) {
    const li = document.createElement('li');
    li.innerHTML = result;

    calculator.input.value = result;
    document.querySelector('.history__list').append(li);
  } else {
    calculator.showError();
  }
}

function checkCorrectCode(key) {
  return (
    // ! CHANGE SIMBOL OPERATORS
    (key >= '0' && key <= '9') ||
    key === '+' ||
    key === '-' ||
    key === '*' ||
    key === '/' ||
    key === '%' ||
    key === '(' ||
    key === ')' ||
    key === '.'
  );
}
