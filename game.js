// JavaScript

const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let timer = 60;
let timerInterval;
let matches = 0;
let selectedCards = []; // Array to store the randomly selected cards for the game
let bestScore = localStorage.getItem('bestScore') || 0; // Get the best score from localStorage





startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);




// Define an array of extra cards
const extraCards = [
  { pokemon: "Charizard", imageUrl: "images/Charizard.BS.4.webp" },
  { pokemon: "Pikachu", imageUrl: "images/Pikachu.BS.25.webp" },
  { pokemon: "Dark-Alakazam", imageUrl: "images/Dark-Alakazam.TR.1.webp" },
  { pokemon: "PDark-Vileplume", imageUrl: "images/Dark-Vileplume.TR.13.webp" },
  { pokemon: "Dewgong", imageUrl: "images/Dewgong.BS.25.webp" },
  { pokemon: "Espeon-GX", imageUrl: "images/Espeon-GX.SM1.140.13693 (1).webp" },
  { pokemon: "Ivysaur", imageUrl: "images/Ivysaur.BS.30.webp" },
  { pokemon: "Lapras", imageUrl: "images/Lapras.FO.25.webp" },
  { pokemon: "Mewtwo", imageUrl: "images/Mewtwo.BS.10.webp" },
  { pokemon: "Moltres", imageUrl: "images/Moltres.FO.27.webp" },
  { pokemon: "Poliwhirl", imageUrl: "images/Poliwhirl.BS.38.webp" },
  { pokemon: "Raichu", imageUrl: "images/Raichu.BS.14.webp" },
  { pokemon: "Starmie", imageUrl: "images/Starmie.BS.64.webp" },
  { pokemon: "Voltorb", imageUrl: "images/Voltorb.BS.67.webp" },
  { pokemon: "Vulpix", imageUrl: "images/Vulpix.BS.68.webp" },
  { pokemon: "Zapdos", imageUrl: "images/Zapdos.BS.16.webp" },
  

  // Add your extra card elements here
];

// Function to select a random subset of cards from the extraCards pool
function selectRandomCards() {
  const shuffledCards = extraCards.sort(() => Math.random() - 0.5);
  return shuffledCards.slice(0, 6); // Select 6 random cards for the game
}





function startGame() {
  startButton.disabled = true; // Disable the start button once the game starts
  selectedCards = selectRandomCards();
  shuffleCards();
  startTimer();
}


function resetGame() {
  resetBoardAndShuffle();
  score = 0;
  timer = 60;
  matches = 0;
  scoreElement.textContent = `Score: ${score}`;
  timerElement.textContent = `Timer: ${timer}`;
  stopTimer();
  startButton.disabled = false; // Enable the start button

  scoreElement.classList.remove('blue', 'teal', 'purple');
  timerElement.classList.remove('low'); // Reset timer color
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
  }, 800);
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



// Function to update the color of the score based on different thresholds
function updateScoreColor() {
  scoreElement.textContent = `Score: ${score}`;

  scoreElement.classList.remove('blue', 'teal', 'purple');

  if (score >= 6 && score < 12) {
    scoreElement.classList.add('blue');
  } else if (score >= 12 && score < 18) {
    scoreElement.classList.add('teal');
  } else if (score >= 18) {
    scoreElement.classList.add('purple');
  }
}



// Scores
function incrementScore() {
  score++;
  scoreElement.textContent = `Score: ${score}`;
  updateScoreColor();
}




// Update the timer element to flash red when below 10 seconds
function updateTimerDisplay() {
  timerElement.textContent = `Timer: ${timer}`;

  if (timer < 10) {
    timerElement.classList.add('low');
  } else {
    timerElement.classList.remove('low');
  }
}

// Modify the startTimer function to call the updated updateTimerDisplay function
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();

    if (timer === 0) {
      stopGame();
    }
  }, 1000);
}





function stopTimer() {
  clearInterval(timerInterval);
}

function stopGame() {
  stopTimer();
  cards.forEach(card => card.removeEventListener('click', flipCard));

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore); // Save the best score to localStorage
  }

  bestScoreElement.textContent = `Best Score: ${bestScore}`;

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

