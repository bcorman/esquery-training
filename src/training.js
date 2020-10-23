const prompts = [
  {
    text: `Instructions: Write your solution code in VS Code or equivalent IDE.`,
    code: `goodLuck();`,
  },
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
    text: `Write completion and feedback triggers for this code.`,
    code: `// Starter Code
  let ball = svg.append('circle');
  
  ball.on('click', () => {
    ball.attr('r', 25).attr('cx', 100).attr('cy', 25).attr('fill', 'red');
  })
    
  // Solution Code
  let ball = svg.append('circle');
  
  ball.on('click', () => {
    ball.attr('r', 25).attr('cx', 100).attr('cy', 25).attr('fill', pickRandom(color));
  });`,
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

const updatePrompt = () => {
  const promptText = document.getElementById('prompt');
  codeConsole.innerHTML = prompts[currentPrompt].code;
  promptText.innerHTML = `<h3 class="prompt-text">${currentPrompt + 1} of ${
    prompts.length
  }: ${prompts[currentPrompt].text}</h3>`;
};

export const cyclePrompt = (e) => {
  e.preventDefault();
  localStorage.setItem('currentPrompt', currentPrompt);
  updatePrompt();
  currentPrompt === prompts.length - 1 ? (currentPrompt = 0) : currentPrompt++;
};
