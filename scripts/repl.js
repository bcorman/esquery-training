const codeConsole = document.getElementById('console-source');
const selectorNode = document.getElementById('selector');
const outputConsole = document.getElementById('output');
const resultsNode = document.getElementById('results');
const selectorDisplay = document.getElementById('selector-display');
const copyButton = document.getElementById('copy-button');
const promptButton = document.getElementById('prompt-button');
const promptText = document.getElementById('prompt');

let currentPrompt = Number(localStorage.getItem('currentPrompt'));

if (!currentPrompt) {
  localStorage.setItem('currentPrompt', 0);
  currentPrompt = 0;
}

const prompts = [
  {
    text: `Trigger if the fruit variable has the value 'banana'.`,
    code: `var fruit = 'banana';`,
  },
  {
    text: `Trigger if the code is printing a string instead of an identifier, 
      for example: print('i') instead of print(i). Strings will always use single quotes, and there will be no template strings.`,
    code: `print(identifier);\nprint('string')`,
  },
  {
    text: `Trigger if the code has an if statement inside another if statement.`,
    code: `if (x > 5) {\n  if (x === y) {\n    print(x);\n  }\n}`,
  },
  {
    text: `Trigger if the code has an if statement checking that x and 3 are equal (allow commutation).`,
    code: `if (x === 3) {\n  foo();\n}\n\nif (3 === x) {\n  bar();\n}`,
  },
  {
    text: `Trigger if the num variable is a string instead of a number. Strings will always use single quotes, and there will be no template strings.`,
    code: `var num = '10';`,
  },
  {
    text: `Match the array that contains only 'food', 'equipment', and 'clothing'.`,
    code: `var goodBackpack = ['food', 'equipment', 'clothing'];
var badBackpack = ['food', 'coal', 'cats', 'equipment', 'clothing'];
var worseBackpack = ['garbage'];`,
  },
  {
    text: `The user is expected to change the setup parameters of this classic for loop. Write set of queries and combine them into a 'resetNeeded' trigger that fires any other starter code has been changed.`,
    code: `import { array } from 'otherCode';\n
if (array.length) {
  for (let i = 0; i < array.length; i = i + 1) {
    console.log(array[i]);
  }
}`,
  },
  {
    text: `Write a set of triggers to validate that this code is complete.`,
    code: `// Starter Code
for (var element of ['snap', 'crackle', 'pop']) {\n\n}\n
// Solution Code
for (var element of ['snap', 'crackle', 'pop']) {
  if (element === 'pop') {
    print('Get poppin');
  }
}`,
  },
  {
    text: `Trigger if any property contains a single string instead of an array of strings.`,
    code: `var backpack = {
  food: ['bananas', 'chocolate', 'berries'],
  equipment: 'map, binoculars, light',
  clothing: 'hat, shirt, jacket'
};`,
  },
  {
    text: `Trigger if the variable name starts with a capital letter.`,
    code: `var Pascal = 'PascalCase';\nvar camel = 'camelCase';`,
  },
  {
    text: `Stretch Goal: Write a series of triggers to check for the correct solution, no matter what numbers are in the input array. This will require using ifExecutionContainsSequence().`,
    code: `const fahrenheit = [88, 82, 66, 25, 57, 90];\n
const kelvin = centimeters.map(temp => {
  return (temp - 32) * 5/9 + 273.15;
});

for (temp in kelvin) {
  console.log(temp);
}`,
  },
  {
    text: `Stretch: Trigger if the code has an if statement that checks if x === 3 && y < 7. Match any commutation. Hint: write 8 separate queries and combine with ||.`,
    code: `if (x === 3 && y < 7) {
  taco();
}`,
  },
];

const cyclePrompt = (e) => {
  e.preventDefault();
  localStorage.setItem('currentPrompt', currentPrompt);
  updatePrompt();
  currentPrompt === prompts.length - 1 ? currentPrompt = 0 : currentPrompt++;
};

const updatePrompt = () => {
  codeConsole.innerHTML = prompts[currentPrompt].code;
  promptText.innerHTML = `<h3 class="prompt-text">${currentPrompt + 1} of ${prompts.length}: ${prompts[currentPrompt].text}</h3>`;
};

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
    ast = esprima.parse(codeConsole.value, {sourceType: 'module'});
  } catch (e) {
    isSourceValid = false;
  }
  const selector = selectorNode.value.replace(/\n/g, '');
  outputConsole.innerHTML = '';

  let start; let end; let selectorAst; let matches; let matchesOutput;

  try {
    start = performance.now();
  } catch (e) {
    start = Date.now();
  }

  try {
    selectorAst = esquery.parse(selector, {sourceType: 'module'});
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
  const resultsMessage =
    `<span id='numMatches'>${numMatches}</span> 
    node${numMatches === 1 ? '' : 's'} found in ${duration} ms`;

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

  outputConsole.innerHTML = matchesOutput;
};

codeConsole.addEventListener('change', update);
codeConsole.addEventListener('keyup', update);
selectorNode.addEventListener('change', update);
selectorNode.addEventListener('keyup', update);
copyButton.addEventListener('mousedown', copyQuery);
promptButton.addEventListener('mousedown', cyclePrompt);
promptButton.addEventListener('mousedown', update);

update();
