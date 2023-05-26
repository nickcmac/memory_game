const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let timer = 60;
let timerInterval;
let matches = 0;

startButton.addEventListener('click', startGame);

function startGame() {
  startButton.disabled = true; // Disable the start button once the game starts
  resetBoardAndShuffle();
  resetScore();
  resetTimer();
  startTimer();
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.pokemon === secondCard.dataset.pokemon;

  if (isMatch) {
    matches++; // Increment the matches variable
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  incrementScore();

  if (matches === cards.length / 2) {
    setTimeout(resetBoardAndShuffle, 500);
  } else {
    resetBoard();
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function resetBoardAndShuffle() {
  resetBoard();
  matches = 0;
  shuffleCards();
}

function incrementScore() {
  score++;
  scoreElement.textContent = `Score: ${score}`;
}

function resetScore() {
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerElement.textContent = `Timer: ${timer}`;

    if (timer === 0) {
      stopGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  timer = 60;
  timerElement.textContent = `Timer: ${timer}`;
}

function stopGame() {
  stopTimer();
  cards.forEach(card => card.removeEventListener('click', flipCard));
  // Display final score or perform any other actions you want.
  console.log('Game Over! Final Score:', score);
}

function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
}

shuffleCards();
