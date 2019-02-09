const sourceNode = document.getElementById('console-source');
const selectorNode = document.getElementById('selector');
const outputNode = document.getElementById('output');
const resultsNode = document.getElementById('results');
const selectorDisplay = document.getElementById('selector-display');

const copyConfirmation = () => {
  const copyMessage = document.getElementById('copy-message');
  copyMessage.classList.add('show');
  setTimeout(() => copyMessage.classList.remove('show'), 1000);
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
    ast = esprima.parse(sourceNode.value, { sourceType: 'module' });
  } catch (e) {
    isSourceValid = false;
  }
  const selector = selectorNode.value.replace(/\n/g, ''); // remove line breaks from query string
  outputNode.innerHTML = '';

  let start; let end; let selectorAst; let matches; let matchesOutput;

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
  const duration = Math.round((end - start) * (10 ** 2)) / (10 ** 2);
  const invalidSource = `<span id='numMatches'></span>Invalid Source Code`;
  const invalidSelector = `<span id='numMatches'></span>Invalid Selector`;
  const resultsMessage = `<span id='numMatches'>${numMatches}</span> node${numMatches === 1 ? '' : 's'} found in ${duration} ms`;

  if (isSourceValid && isSelectorValid) {
    resultsNode.innerHTML = resultsMessage;
  } else if (isSourceValid) {
    resultsNode.innerHTML = invalidSelector;
  } else {
    resultsNode.innerHTML = invalidSource;
  }

  const positiveStyle = () => {
    selectorDisplay.classList.remove('bad');
    resultsNode.classList.remove('bad');
    resultsNode.classList.add('good');
  };

  const negativeStyle = () => {
    selectorDisplay.classList.add('bad');
    resultsNode.classList.remove('good');
    resultsNode.classList.add('bad');
  };

  if (numMatches) {
    positiveStyle();
  } else {
    negativeStyle();
  }

  outputNode.innerHTML = matchesOutput;
};

update();

sourceNode.addEventListener('change', update);
sourceNode.addEventListener('keyup', update);
selectorNode.addEventListener('change', update);
selectorNode.addEventListener('keyup', update);

const copyBtn = document.getElementById('copy-button');

copyBtn.addEventListener('mousedown', copyQuery);
