const choices = ["Rock", "Paper", "Scissors"];
const buttons = document.querySelectorAll("#game-area button");
const resultArea = document.getElementById("result-area");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const resetButton = document.getElementById("reset-button");

let playerScore = 0;
let computerScore = 0;
let currentRound = 1; // Renamed from 'round' to 'currentRound'

const soundManager = {
  sounds: {
    win: new Audio("win.mp3"),
    lose: new Audio("lose.mp3"),
    tie: new Audio("tie.mp3")
  },
  play(sound) {
    if (!this.sounds[sound].paused) {
      this.sounds[sound].currentTime = 0;
    }
    this.sounds[sound].play();
  }
};

// Preload audio files to reduce delay
Object.values(soundManager.sounds).forEach(sound => {
  sound.play();
  sound.pause();
  sound.currentTime = 0;
});

function textToSpeech(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  window.speechSynthesis.speak(speech);
}

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function playRound(playerChoice, computerChoice) {
  const playerIndex = choices.indexOf(playerChoice);
  const computerIndex = choices.indexOf(computerChoice);

  if (playerIndex === computerIndex) {
    soundManager.play('tie');
    return "It's a tie!";
  } else if (
    (playerIndex === 0 && computerIndex === 2) || // Rock beats Scissors
    (playerIndex === 1 && computerIndex === 0) || // Paper beats Rock
    (playerIndex === 2 && computerIndex === 1)    // Scissors beats Paper
  ) {
    playerScore++;
    soundManager.play('win');
    return `You win! ${playerChoice} beats ${computerChoice}.`;
  } else {
    computerScore++;
    soundManager.play('lose');
    return `You lose! ${computerChoice} beats ${playerChoice}.`;
  }
}

function announceResult(result) {
  resultArea.textContent = `${result}  Player Score: ${playerScore}  Computer Score: ${computerScore}`;
  textToSpeech(result);
  playerScoreElement.textContent = playerScore;
  computerScoreElement.textContent = computerScore;

  if (playerScore === 2 || computerScore === 2) {
    gameOver();
  }
}

function gameOver() {
  let message = "";
  if (playerScore === 2) {
    message = "Congratulations! You won the game!";
  } else {
    message = "Oh no! You lost the game.";
  }
  resultArea.textContent = message;
  buttons.forEach(button => button.disabled = true); // Disable buttons after game over
}

buttons.forEach(button => {
  button.addEventListener("click", function () {
    this.classList.add('selected');
    setTimeout(() => this.classList.remove('selected'), 500); // Remove highlight after 500 ms

    const playerChoice = this.getAttribute("aria-label");
    const computerChoice = getComputerChoice();
    const result = playRound(playerChoice, computerChoice);
    announceResult(result);
    currentRound++;
  });
});

resetButton.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  currentRound = 1;
  resultArea.textContent = ""; // Clear result text
  playerScoreElement.textContent = playerScore;
  computerScoreElement.textContent = computerScore;
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove("winner", "loser", "selected");
  });
});

/* CSS Section */
/* Add this to your style file or inline in the HTML */
.selected {
  background-color: #f0e68c; /* Khaki background for selected button */
  color: black;
  transition: background-color 0.5s ease;
}
