// JavaScript
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
let selectedCards = [];
let bestScore = localStorage.getItem('bestScore') || 0;



startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

function startGame() {
  startButton.disabled = true;
  selectedCards = selectRandomCards(6); // Pass the number of cards to select
  const pairedCards = createCardPairs(selectedCards); // Create pairs for each unique card
  const combinedCards = shuffleCards([...pairedCards]); // Shuffle the combined pairs
  deployCards(combinedCards); // Deploy the shuffled pairs to the HTML elements
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

function selectRandomCards(numCards) {
  const shuffledCards = extraCards.sort(() => Math.random() - 0.5);
  return shuffledCards.slice(0, numCards);
}

function createCardPairs(cards) {
  const pairedCards = [];
  for (let i = 0; i < cards.length; i++) {
    pairedCards.push(cards[i], cards[i]);
  }
  return pairedCards;
}

function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements to shuffle the array
  }
  return cards;
}

function deployCards(cards) {
  const memoryCards = document.querySelectorAll('.memory-card');
  cards.forEach((card, index) => {
    const frontImgUrl = card.imgUrl;
    const pokemonName = card.name;
    const cardElement = memoryCards[index];

    cardElement.dataset.pokemon = pokemonName;
    cardElement.querySelector('.front-face').src = frontImgUrl;
    cardElement.querySelector('.front-face').alt = pokemonName;
    cardElement.classList.remove('flip'); // Ensure cards start unflipped
    cardElement.addEventListener('click', flipCard);
  });
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
    // Reset hasFlippedCard and firstCard variables
  } else {
    unflipCards();
  }
}


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  incrementScore();

  if (matches === 6) {
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
  selectedCards = selectRandomCards(6); // Generate new set of randomly selected cards
  const pairedCards = createCardPairs(selectedCards); // Create pairs for each unique card
  const combinedCards = shuffleCards([...pairedCards]); // Shuffle the combined pairs
  deployCards(combinedCards); // Deploy the shuffled pairs to the HTML elements
}

// Function to update the color of the score based on different thresholds
function updateScoreColor() {
  scoreElement.textContent = `Score: ${score}`;

  scoreElement.classList.remove('blue', 'teal', 'purple', 'gold','rainbow');

  if (score >= 6 && score < 12) {
    scoreElement.classList.add('blue');
  } else if (score >= 12 && score < 16) {
    scoreElement.classList.add('teal');
  } else if (score >= 16 && score < 18) {
    scoreElement.classList.add('purple');
  } else if (score >= 18 && score < 20) {
    scoreElement.classList.add('gold');
  } else if (score >= 20) {
    scoreElement.classList.add('rainbow');
    
  }
  
}

function incrementScore() {
  score++;
  updateScoreColor();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerElement.textContent = `Timer: ${timer}`; //Gets the timer = time from top ^

    if (timer <= 10) {
      timerElement.classList.add('low');
      timerElement.classList.add('flashing');
    }

    if (timer === 0) {
      clearInterval(timerInterval);
      stopGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function stopGame() {
  lockBoard = true;
  resetButton.disabled = false;
  startButton.disabled = true;
  resetButton.classList.add('disabled');
  timerElement.classList.remove('flashing');
  removeEventListener('click',flipCard);

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore); // Save the best score to localStorage
  }

  bestScoreElement.textContent = `Best Score: ${bestScore}`;

  // Display final score or perform any other actions you want.
  console.log('Game Over! Final Score:', score);
}


// Pre-defined cards for testing
const extraCards = [
  { id: 1, name: "Charizard", imgUrl: "images/Charizard.BS.4.webp" },
  { id: 2, name: "Oak", imgUrl: "images/Professor-Oak.BS.88.webp" },
  { id: 3, name: "Dark-Alakazam", imgUrl: "images/Dark-Alakazam.TR.1.webp" },
  { id: 4, name: "PDark-Vileplume", imgUrl: "images/Dark-Vileplume.TR.13.webp" },
  { id: 5, name: "Dewgong", imgUrl: "images/Dewgong.BS.25.webp" },
  { id: 6, name: "Espeon-GX", imgUrl: "images/Espeon-GX.SM1.140.13693 (1).webp" },
  { id: 7, name: "Ivysaur", imgUrl: "images/Ivysaur.BS.30.webp" },
  { id: 8, name: "Lapras", imgUrl: "images/Lapras.FO.25.webp" },
  { id: 9, name: "Mewtwo", imgUrl: "images/Mewtwo.BS.10.webp" },
  { id: 10, name: "Moltres", imgUrl: "images/Moltres.FO.27.webp" },
  { id: 11, name: "Poliwhirl", imgUrl: "images/Poliwhirl.BS.38.webp" },
  { id: 12, name: "Raichu", imgUrl: "images/Raichu.BS.14.webp" },
  { id: 13, name: "Starmie", imgUrl: "images/Starmie.BS.64.webp" },
  { id: 14, name: "Voltorb", imgUrl: "images/Voltorb.BS.67.webp" },
  { id: 15, name: "Vulpix", imgUrl: "images/Vulpix.BS.68.webp" },
  { id: 16, name: "Zapdos", imgUrl: "images/Zapdos.BS.16.webp" },
  

  // Add your extra card elements here
];
