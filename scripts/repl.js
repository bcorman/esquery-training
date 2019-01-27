const sourceNode = document.getElementById('console-source');
const selectorNode = document.getElementById('selector');
const selectorAstNode = document.getElementById('selector-ast');
const outputNode = document.getElementById('output');
const resultsNode = document.getElementById('results');

const display = document.getElementById('display');
const selectorLabel = document.querySelector('#selector-display .label');
const sourceLabel = document.querySelector('#console-display .label');
const sourceDisplay = document.querySelector('#console-display');
// const outputDisplay = document.getElementById('output-display');

const highlightSelector = (e) => {
  selectorLabel.classList.add('highlight');
  selectorNode.classList.add('highlight');
};

const unHighlightSelector = (e) => {
  selectorLabel.classList.remove('highlight');
  selectorNode.classList.remove('highlight');
};

const highlightSource = (e) => {
  sourceLabel.classList.add('highlight');
  sourceDisplay.classList.add('highlight');
  sourceNode.classList.add('highlight');
};

const unHighlightSource = (e) => {
  sourceLabel.classList.remove('highlight');
  sourceDisplay.classList.remove('highlight');
  sourceNode.classList.remove('highlight');
};

const copyConfirmation = () => {
  const copyMessage = document.getElementById('copy-message');
  copyMessage.classList.add('show');
  setTimeout(e => copyMessage.classList.remove('show'), 1000);
};

const copyQuery = (e) => {
  const originalValue = selectorNode.value;
  const formattedValue = selectorNode.value.replace(/\n/g, '');
  selectorNode.value = formattedValue;
  selectorNode.select();
  document.execCommand('copy');
  selectorNode.value = originalValue;
  selectorNode.blur();

  e.target.classList.add('highlight');
  setTimeout(() => {
    e.target.classList.remove('highlight');
  }, 300); // 300ms corresponds to the *.highlight css transition timing

  copyConfirmation();
};

const update = () => {
  let isSourceValid = true;
  let isSelectorValid = true;
  let ast;

  try {
    ast = esprima.parse(sourceNode.value);
  } catch (e) {
    isSourceValid = false;
    console.log(e);
  }
  let selector = selectorNode.value.replace(/\n/g, ''); // remove line breaks from query string
  selectorAstNode.innerHTML = '';
  outputNode.innerHTML = '';

  let start; let end; let selectorAst; let selectorAstOutput; let matches; let matchesOutput;

  try {
    start = performance.now();
  } catch (e) {
    start = Date.now();
  }

  try {
    selectorAst = esquery.parse(selector);
  } catch (e) {
    isSelectorValid = false;
    selectorAstOutput = e.message;
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

  selectorAstOutput = selectorAstOutput || JSON.stringify(selectorAst, null, '  ');
  matchesOutput = matchesOutput || JSON.stringify(matches, null, '  ');

  selectorAstNode.appendChild(document.createTextNode(selectorAstOutput));

  const numMatches = matches ? matches.length : 0;
  const duration = Math.round((end - start) * Math.pow(10, 2)) / Math.pow(10, 2);

  const invalidSource = `<span id='numMatches'></span>Invalid Source Code`;
  const invalidSelector = `<span id='numMatches'></span>Invalid Selector`;
  const resultsMessage = `<span id='numMatches'>${numMatches}</span> node${numMatches === 1 ? '':'s'} found in ${duration} ms`;

  resultsNode.innerHTML = isSourceValid && isSelectorValid ? resultsMessage : isSourceValid ? invalidSelector : invalidSource;

  const positiveStyle = () => {
    display.classList.remove('bad');
    resultsNode.classList.remove('bad');
    resultsNode.classList.add('good');
  };

  const negativeStyle = () => {
    display.classList.add('bad');
    resultsNode.classList.remove('good');
    resultsNode.classList.add('bad');
  };

  numMatches ? positiveStyle() : negativeStyle();
  outputNode.innerHTML = matchesOutput;
};

update();

selectorNode.addEventListener('focus', highlightSelector);
selectorNode.addEventListener('blur', unHighlightSelector);
sourceNode.addEventListener('focus', highlightSource);
sourceNode.addEventListener('blur', unHighlightSource);

sourceNode.addEventListener('change', update);
sourceNode.addEventListener('keyup', update);
selectorNode.addEventListener('change', update);
selectorNode.addEventListener('keyup', update);

const copyBtn = document.getElementById('copy-button');

copyBtn.addEventListener('mousedown', copyQuery);
