const crypto = require('crypto');

function generateTable(moves) {
  const n = moves.length;
  const table = Array.from({ length: n + 1 }, () => Array(n + 1).fill(' '));

  for (let i = 1; i <= n; i++) {
    table[0][i] = moves[i - 1];
    table[i][0] = moves[i - 1];
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      table[i][j] = compareMoves(moves[i - 1], moves[j - 1], moves);
    }
  }

  return table;
}

function compareMoves(move1, move2, moves) {
  if (!move1 || !move2) {
    return '';
  }

  const middle = Math.floor(moves.length / 2);
  const index1 = moves.indexOf(move1);
  const index2 = moves.indexOf(move2);

  if (index1 === index2) {
    return 'Draw';
  } else if (index1 < index2) {
    return index2 - index1 <= middle ? 'Win' : 'Lose';
  } else {
    return index1 - index2 > middle ? 'Win' : 'Lose';
  }
}

function generateComputerMove(moves) {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

function calculateHmac(key, message) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message);
  return hmac.digest('hex');
}

function printTable(table) {
  const n = table.length;
  const cellWidth = 12; 

  
  let headerRow = '| v PC\\User >';
  for (let i = 1; i < n; i++) {
    headerRow += ` | ${table[0][i].padEnd(cellWidth)}`;
  }
  headerRow += ' |';
  console.log(headerRow);

  
  let separatorRow = '+'.padEnd(cellWidth + 2, '-');
  for (let i = 1; i < n; i++) {
    separatorRow += '+'.padEnd(cellWidth + 2, '-');
  }
  separatorRow += '+';
  console.log(separatorRow);


  for (let i = 1; i < n; i++) {
    let row = `| ${table[i][0].padEnd(cellWidth)}`;
    for (let j = 1; j < n; j++) {
      row += ` | ${table[i][j].padEnd(cellWidth)}`;
    }
    row += ' |';
    console.log(row);
  }
}

function playGame(moves) {
  const key = crypto.randomBytes(32);
  console.log(`HMAC: ${calculateHmac(key, key.toString('hex'))}`);
  console.log('Available moves:');
  moves.forEach((move, idx) => console.log(`${idx + 1} - ${move}`));
  console.log('0 - exit');
  console.log('? - help');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function promptUser() {
    readline.question('Enter your move: ', (userInput) => {
      if (userInput === '?') {
        const table = generateTable(moves);
        console.log('\nMove comparison table:');
        printTable(table);
        console.log('0 - exit');
        console.log('? - help');
        promptUser(); 
      } else if (userInput === '0') {
        console.log('Exiting the game.');
        readline.close();
      } else {
        const moveIndex = parseInt(userInput, 10) - 1;
        if (!isNaN(moveIndex) && moveIndex >= 0 && moveIndex < moves.length) {
          const userMove = moves[moveIndex];
          const computerMove = generateComputerMove(moves);
          const result = compareMoves(userMove, computerMove, moves);

          console.log(`Your move: ${userMove}`);
          console.log(`Computer move: ${computerMove}`);
          console.log(`You ${result.toLowerCase()}!`);
          console.log(`HMAC key: ${key.toString('hex')}`);
        } else {
          console.log('Invalid input. Please try again.');
        }
        promptUser();
      }
    });
  }

  promptUser();
}

const args = process.argv.slice(2);
if (args.length < 3 || args.length % 2 === 0 || (new Set(args)).size !== args.length) {
  console.log('Error: Incorrect number of moves or non-repeating strings.');
  console.log('Example of correct usage: node game.js rock paper scissors');
} else {
  playGame(args);
}