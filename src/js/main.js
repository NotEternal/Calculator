'use strict';
// TODO: event.clipboardData -> разобратся с событием для копирования при нажатии на историю
const calculator = {
  calc: document.querySelector('.calc'),
  input: document.querySelector('.calc__input'),
  cache: new Map(),
  result: false,

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
    const expression = this.input.value;

    this.result = false;

    if (+expression) {
      this.result = +expression;
    } else if (expression != '') {
      this.result = checksExpressionAndReturnResult(expression, this.cache);
    }

    return this.result;
  },

  showError() {
    this.input.classList.add('error');
  },

  hideError() {
    this.input.classList.remove('error');
  },
};

function checksExpressionAndReturnResult(exp, cache) {
  if (checkCorrectSimbols(exp)) {
    if (cache.has(exp)) {
      return cache.get(exp);
    } else {
      const result = returnResultExpression(exp.split(''))[0];

      cache.set(exp, result);
      return result;
    }
  }
}

function checkCorrectSimbols(strInput) {
  if (
    checksFirstAndLastChars(strInput) &&
    checksErrCharsBeside(strInput) &&
    checksBrackets(strInput)
  ) {
    return true;
  }

  return false;
}

function checksFirstAndLastChars(str) {
  const firstErrChar = /^[%×÷\-\)²]/.test(str);
  const lastErrChar = /[×÷\-+√\(]$/.test(str);

  if (firstErrChar || lastErrChar) {
    return false;
  }

  return true;
}

function checksErrCharsBeside(str) {
  // TODO:: разобраться со случаями:
  // цифры не играют роли
  // !       '(2²)-(8+1)'

  const regFalseCase = /\d√|(²|%)(\d|√)|\d\(|\)\d/;

  if (regFalseCase.test(str)) {
    return false;
  }

  return true;
}

function checksBrackets(str) {
  if (/\(/.test(str)) {
    const arrBrackets = str.match(/\(|\)/g);
    // not event brackets
    if (arrBrackets.length % 2 != 0) {
      return false;
    }

    const arrOpenBrakets = arrBrackets.slice(0, arrBrackets.length / 2);
    const arrCloseBrakets = arrBrackets.slice(
      arrBrackets.length / 2,
      arrBrackets.length
    );
    // wrong sequence
    if (arrOpenBrakets.includes(')') || arrCloseBrakets.includes('(')) {
      return false;
    }
  }

  return true;
}

function returnResultExpression(arr) {
  if (arr.length === 1) {
    return arr[0];
  }

  if (arr.includes('(')) {
    const resultInBrakets = returnResultExpression(
      returnSimbBetweenBrakets(arr)
    );
    const [
      indexOpenBracket,
      indexCloseBracket,
    ] = returnIndexOpenAndCloseBrakets(arr);

    arr.splice(
      indexOpenBracket,
      indexCloseBracket - indexOpenBracket + 1,
      resultInBrakets
    );

    return returnsResultExpressionWithoutBrakets(arr);
  } else {
    return returnsResultExpressionWithoutBrakets(arr);
  }
}

function returnSimbBetweenBrakets(arr) {
  const arrSimbInBrakets = [];
  let counterBrakets = 0;

  for (let item of arr) {
    if (item === '(' && counterBrakets === 0) {
      counterBrakets += 1;
    } else if (item === '(') {
      counterBrakets += 1;
      arrSimbInBrakets.push(item);
    } else if (item === ')' && counterBrakets != 1) {
      counterBrakets -= 1;
      arrSimbInBrakets.push(item);
    } else if (item === ')') {
      break;
    } else if (counterBrakets >= 1) {
      arrSimbInBrakets.push(item);
    }
  }

  return arrSimbInBrakets;
}

function returnIndexOpenAndCloseBrakets(arr) {
  let indexOpenBracket = 0;
  let indexCloseBracket = 0;
  let counterBrakets = 0;

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === '(' && counterBrakets === 0) {
      counterBrakets += 1;
      indexOpenBracket = i;
    } else if (arr[i] === '(') {
      counterBrakets += 1;
    } else if (arr[i] === ')' && counterBrakets != 1) {
      counterBrakets -= 1;
    } else if (arr[i] === ')' && counterBrakets === 1) {
      indexCloseBracket = i;
    }
  }

  return [indexOpenBracket, indexCloseBracket];
}

function returnsResultExpressionWithoutBrakets(arr) {
  const endArr = brakeOnNumberAndOperators(arr);
  const targetOperatorIndex = returnOperatorFromTopPriority(endArr);
  const arrSimpleExpression =
    targetOperatorIndex === -1
      ? endArr
      : returnSimpleExpression(endArr, targetOperatorIndex);
  const resultSimpleExpression = returnResultSimpleExpression(
    arrSimpleExpression
  );

  // * save debag _________________________________
  // console.log(`
  //   end array: ${endArr}
  //   target operator index: ${targetOperatorIndex}
  //   array simple expression: ${arrSimpleExpression}
  // `);s
  // * save debag _________________________________

  // change operator and operands on result
  if (arrSimpleExpression.length === 2) {
    switch (arrSimpleExpression[0]) {
      case '√':
        endArr.splice(targetOperatorIndex, 2, resultSimpleExpression);
        break;

      case '%':
      case '²':
        endArr.splice(targetOperatorIndex - 1, 2, resultSimpleExpression);
        break;
    }
  } else {
    endArr.splice(targetOperatorIndex - 1, 3, resultSimpleExpression);
  }

  if (endArr.length > 1) {
    return returnsResultExpressionWithoutBrakets(endArr);
  } else {
    return endArr;
  }
}

function brakeOnNumberAndOperators(arr) {
  let numStr = '';
  const newArr = [];
  const operators = {
    // operators: priority
    '-': 1,
    '+': 1,
    '÷': 2,
    '×': 2,
    '√': 3,
    '²': 3,
    '%': 3,
  };

  // TODO: разобраться с добавлением лишней решетки и приоритета
  // * это происходит при каждом рекурсивном вызове для решения выражения
  // ? сделать проверку содержит ли строка с оператором решётку
  for (let item of arr) {
    if ((Object.is(+item, NaN) && item === '.') || !Object.is(+item, NaN)) {
      numStr += item;
    } else {
      item += '#' + operators[item];
      numStr === '' ? newArr.push(item) : newArr.push(numStr, item);
      numStr = '';
    }
  }

  if (numStr != '') {
    newArr.push(numStr);
  }

  return newArr;
}

function returnOperatorFromTopPriority(arr) {
  let indexOperator = -1;
  let priority = 0;

  for (let i = 0; i < arr.length; i += 1) {
    if (Object.is(+arr[i], NaN)) {
      if (indexOperator === -1) {
        indexOperator = i;
        const operator = arr[i];
        priority = +operator[2];
      } else {
        const newOperator = arr[i];
        const newPriority = +newOperator[2];

        if (newPriority > priority) {
          indexOperator = i;
          priority = newPriority;
        }
      }
    }
  }

  return indexOperator;
}

function returnSimpleExpression(arr, operatorIndex) {
  const operator = arr[operatorIndex][0];
  let resultArr = [];

  switch (operator) {
    case '√':
      resultArr = [operator, arr[operatorIndex + 1]];
      break;

    case '%':
    case '²':
      resultArr = [operator, arr[operatorIndex - 1]];
      break;

    default:
      resultArr = [arr[operatorIndex - 1], operator, arr[operatorIndex + 1]];
  }

  return resultArr;
}

function returnResultSimpleExpression(arrExpression) {
  let result;

  if (arrExpression.length === 1) {
    result = +arrExpression[0];
  } else if (arrExpression.length === 2) {
    switch (arrExpression[0]) {
      case '√':
        result = Math.sqrt(+arrExpression[1]);
        break;

      case '²':
        result = (+arrExpression[1]) ** 2;
        break;

      case '%':
        result = +arrExpression[1] / 100;
        break;
    }
  } else {
    switch (arrExpression[1]) {
      case '-':
        result = +arrExpression[0] - +arrExpression[2];
        break;

      case '+':
        result = +arrExpression[0] + +arrExpression[2];
        break;

      case '×':
        result = +arrExpression[0] * +arrExpression[2];
        break;

      case '÷':
        result = +arrExpression[0] / +arrExpression[2];
        break;
    }
  }

  // TODO: разобратся с потерей точности
  // ? как правильно округлять

  if (result > -Number.MAX_SAFE_INTEGER && result < Number.MAX_SAFE_INTEGER) {
    return result;
  }

  return false;
}

// EVENTS AND SANDLERS _________________________________________________________

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

      case 'square-root':
        calculator.input.value += '²';
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
    event.code === 'ArrowRight' ||
    event.code === 'Delete'
  ) {
    return;
  } else if (event.code === 'Enter') {
    viewResult();
  } else if (!checkCorrectCode(event.key)) {
    event.preventDefault();
  }
});

function viewResult() {
  const userExpression = calculator.input.value;
  const result = calculator.getResult();

  if (result || result === 0) {
    const li = document.createElement('li');

    li.className = 'show';
    li.innerHTML = `${userExpression} = ${result}`;
    document.querySelector('.history__list').append(li);

    calculator.input.value = result;
  } else {
    calculator.showError();
  }
}

function checkCorrectCode(key) {
  return (
    (key >= '0' && key <= '9') ||
    key === '+' ||
    key === '-' ||
    key === '×' ||
    key === '÷' ||
    key === '%' ||
    key === '²' ||
    key === '(' ||
    key === ')' ||
    key === '.'
  );
}

document.querySelector('.history__btn-clear').onclick = () => {
  document.querySelector('.history__list').innerHTML = '';
};

document.querySelector('.history__btn-view').onclick = () => {
  document.querySelector('.history').classList.toggle('show');
};
