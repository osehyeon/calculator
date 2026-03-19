const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let current = '0';
let expression = '';
let shouldReset = false;

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent = expression;
}

function inputNumber(value) {
  if (shouldReset) {
    current = '0';
    shouldReset = false;
  }
  if (value === '.' && current.includes('.')) return;
  if (current === '0' && value !== '.') {
    current = value;
  } else {
    current += value;
  }
  updateDisplay();
}

function inputOperator(op) {
  if (expression && !shouldReset) {
    calculate();
  }
  const displayOp = { '/': ' ÷ ', '*': ' × ', '-': ' − ', '+': ' + ' };
  expression = current + (displayOp[op] || ` ${op} `);
  shouldReset = true;
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  const opMatch = expression.match(/[÷×−+]/);
  if (!opMatch) return;

  const opMap = { '÷': '/', '×': '*', '−': '-', '+': '+' };
  const operator = opMap[opMatch[0]];
  const left = parseFloat(expression.split(/\s+[÷×−+]\s+/)[0]);
  const right = parseFloat(current);

  if (operator === '/' && right === 0) {
    current = '오류';
    expression = '';
    shouldReset = true;
    updateDisplay();
    return;
  }

  let result;
  switch (operator) {
    case '+': result = left + right; break;
    case '-': result = left - right; break;
    case '*': result = left * right; break;
    case '/': result = left / right; break;
  }

  const fullExpression = expression + current + ' =';
  current = parseFloat(result.toFixed(10)).toString();
  expression = fullExpression;
  shouldReset = true;
  updateDisplay();
}

function clear() {
  current = '0';
  expression = '';
  shouldReset = false;
  updateDisplay();
}

function backspace() {
  if (shouldReset) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function percent() {
  current = (parseFloat(current) / 100).toString();
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;

  if (btn.classList.contains('number')) {
    inputNumber(action);
  } else if (btn.classList.contains('operator')) {
    inputOperator(action);
  } else if (action === '=') {
    calculate();
  } else if (action === 'clear') {
    clear();
  } else if (action === 'backspace') {
    backspace();
  } else if (action === 'percent') {
    percent();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') inputNumber(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) inputOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clear();
});
