const colors = require("ansi-colors");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Player {
  chooseMove() {}
}

class HumanPlayer extends Player {
  chooseMove() {
    const validMoves = ["rock", "paper", "scissors"];

    return new Promise((resolve) => {
      const askMove = () => {
        rl.question(
          `Choose rock, paper, or scissors. Type 'quit' to exit or 'rules' for instructions: `,
          (answer) => {
            const move = answer.trim().toLowerCase();
            if (validMoves.includes(move)) {
              resolve(move);
            } else if (move === "quit") {
              rl.close();
            } else if (move === "rules") {
              console.log(` Rules:
                1. Rock wins against scissors.
                2. Scissors win against paper.
                3. Paper wins against rock.`);
              askMove();
            } else {
              console.log(
                "Invalid choice. Please choose rock, paper, or scissors."
              );
              askMove();
            }
          }
        );
      };
      askMove();
    });
  }
}

class ComputerPlayer extends Player {
  chooseMove() {
    const moves = ["rock", "paper", "scissors"];
    const choice = moves[Math.floor(Math.random() * 3)];
    // console.log(`Computer chooses: ${choice}`);
    return choice;
  }
}

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.results = {
      wins: 0,
      losses: 0,
      draws: 0,
    };
  }
  determineWinner(move1, move2) {
    if (move1 === move2) {
      return "draw";
    }

    if (
      (move1 === "rock" && move2 === "scissors") ||
      (move1 === "scissors" && move2 === "paper") ||
      (move1 === "paper" && move2 === "rock")
    ) {
      return "win";
    } else {
      return "lose";
    }
  }

  async playRound() {
    const move1 = await this.player1.chooseMove();
    const move2 = this.player2.chooseMove();

    console.log(`You chose: ${move1}`);
    console.log(`Computer chose: ${move2}`);

    const result = this.determineWinner(move1, move2);

    if (result === "win") {
      console.log(colors.green("You win this round!"));
      this.results.wins += 1;
    } else if (result === "lose") {
      console.log(colors.red("You lose this round!"));
      this.results.losses += 1;
    } else {
      console.log(colors.yellow("It's a draw!"));
      this.results.draws += 1;
    }
  }

  async askPlayAgain() {
    return new Promise((resolve) => {
      rl.question("Do you want to play again: ", (answer) => {
        resolve(answer.trim().toLowerCase() === "yes");
      });
    });
  }
}

async function playGame() {
  let keepPlaying = true;

  while (keepPlaying) {
    await game.playRound();

    console.log("\nCurrent Score:");
    console.log(colors.green(`Wins: ${game.results.wins}`));
    console.log(colors.red(`Losses: ${game.results.losses}`));
    console.log(colors.yellow(`Draws: ${game.results.draws}\n`));

    keepPlaying = await game.askPlayAgain();
  }

  console.log("Thanks for playing!");
  rl.close();
}

const human = new HumanPlayer();
const computer = new ComputerPlayer();
const game = new Game(human, computer);

playGame();