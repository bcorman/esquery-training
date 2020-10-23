import { cyclePrompt } from './training';
const codeConsole = document.getElementById('console-source');
const selectorNode = document.getElementById('selector');
const outputConsole = document.getElementById('output');
const resultsNode = document.getElementById('results');
const copyButton = document.getElementById('copy-button');
const darkButton = document.getElementById('dark-toggle');
const promptButton = document.getElementById('prompt-button');

let currentPrompt = Number(localStorage.getItem('currentPrompt'));
let isDark = JSON.parse(localStorage.getItem('isDark'));

if (!currentPrompt) {
  localStorage.setItem('currentPrompt', 0);
  currentPrompt = 0;
}

if (isDark) {
  document.body.setAttribute('class', 'dark');
}

const copyConfirmation = () => {
  const copyMessage = document.getElementById('copy-message');
  copyMessage.classList.add('show');
  setTimeout(() => copyMessage.classList.remove('show'), 1500);
};

const copyQuery = () => {
  const originalValue = selectorNode.value;
  const formattedValue = selectorNode.value.replace(/\n/g, '');
  selectorNode.value = formattedValue;
  selectorNode.select();
  document.execCommand('copy');
  selectorNode.value = originalValue;
  selectorNode.blur();
  copyConfirmation();
};

const update = () => {
  let isSourceValid = true;
  let isSelectorValid = true;
  let ast;

  try {
    ast = esprima.parse(codeConsole.value, { sourceType: 'module' });
  } catch (e) {
    isSourceValid = false;
  }
  const selector = selectorNode.value.replace(/\n/g, '');
  outputConsole.innerHTML = '';

  let start;
  let end;
  let selectorAst;
  let matches;
  let matchesOutput;

  try {
    start = performance.now();
  } catch (e) {
    start = Date.now();
  }

  try {
    selectorAst = esquery.parse(selector, { sourceType: 'module' });
  } catch (e) {
    isSelectorValid = false;
  }

  try {
    matches = esquery.match(ast, selectorAst);
  } catch (e) {
    matchesOutput = e.message;
  }

  try {
    end = performance.now();
  } catch (e) {
    end = Date.now();
  }

  matchesOutput = matchesOutput || JSON.stringify(matches, null, '  ');

  const numMatches = matches ? matches.length : 0;
  const duration = Math.round((end - start) * 10 ** 2) / 10 ** 2;
  const invalidSource = `<span id='numMatches'></span>Invalid Source Code`;
  const invalidSelector = `<span id='numMatches'></span>Invalid Selector`;
  const resultsMessage = `<span id='numMatches'>${numMatches}</span> 
    node${numMatches === 1 ? '' : 's'} found in ${duration} ms`;

  if (isSourceValid && isSelectorValid) {
    resultsNode.innerHTML = resultsMessage;
  } else if (isSourceValid) {
    resultsNode.innerHTML = invalidSelector;
  } else {
    resultsNode.innerHTML = invalidSource;
  }

  outputConsole.innerHTML = matchesOutput;
};

const toggleTheme = () => {
  isDark = !isDark;
  localStorage.setItem('isDark', isDark);
  document.body.setAttribute('class', `${isDark ? 'dark' : ''}`);
};

codeConsole.addEventListener('change', update);
codeConsole.addEventListener('keyup', update);
selectorNode.addEventListener('change', update);
selectorNode.addEventListener('keyup', update);
copyButton.addEventListener('mousedown', copyQuery);
promptButton.addEventListener('mousedown', cyclePrompt);
promptButton.addEventListener('mousedown', update);
darkButton.addEventListener('mousedown', toggleTheme);

update();
