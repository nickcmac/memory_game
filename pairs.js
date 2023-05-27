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

/*
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

  { id: 17, name: "Baxcalibur", imgUrl: "images/Baxcalibur.PALEN.210.47759.webp" },
  { id: 18, name: "Blastoise-Piplup", imgUrl: "images/Blastoise-Piplup-GX.CEC.38.30122.webp" },
  { id: 19, name: "Braixen", imgUrl: "images/Charizard-Braixen-GX.CEC.22.30121.webp" },
  { id: 20, name: "Charmander", imgUrl: "images/Charmander.RG.113.webp" },
  { id: 21, name: "Chi-Yu", imgUrl: "images/Chi-Yu-ex.PALEN.40.47758.webp" },
  { id: 22, name: "Lunatone", imgUrl: "images/Lunatone.DX.36.webp" },
  { id: 23, name: "Magcargo", imgUrl: "images/Magcargo.DX.20.webp" },
  { id: 24, name: "Naganadel", imgUrl: "images/Naganadel-Guzzlord-GX.CEC.158.30126.webp" },
  { id: 25, name: "Tangela", imgUrl: "images/Tangela.BS.66.webp" },
  { id: 26, name: "Ninetales", imgUrl: "images/Ninetales.BS.12.webp" },
  { id: 27, name: "Paras", imgUrl: "images/Paras.RG.72.webp" },
  { id: 28, name: "Tyranitar", imgUrl: "images/Tyranitar.SV2EN.222.47689.webp" },
  { id: 29, name: "Manectric", imgUrl: "images/Manectric.DX.38.webp" },
  { id: 30, name: "Kyogre", imgUrl: "images/Team-Aquas-Kyogre.MA.3.webp" },
  { id: 31, name: "Snivy", imgUrl: "images/Venusaur-Snivy-GX.CEC.1.30120.webp" },
  { id: 32, name: "Solgaleo", imgUrl: "images/Solgaleo-Lunala-GX.CEC.75.30124.webp" },
  
  

  // Add your extra card elements here
];

*/
// Example code for adding best scores
const bestScoresList = document.getElementById('best-scores-list');
const bestScores = [];

function updateBestScores() {
  bestScoresList.innerHTML = ''; // Clear the list

  bestScores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = score;
    bestScoresList.appendChild(li);
  });
}

// Call the updateBestScores() function whenever you want to update the best scores list

/*
{ id:1 , name: "", imgUrl: "images/res/Torkoal.SM1.23.13585.webp" },
{ id:2, name: "", imgUrl: "images/res/" },
{ id:3 , name: "", imgUrl: "images/res/" },
{ id:4 , name: "", imgUrl: "images/res/" },

/*
{ id: , name: "", imgUrl: "images" },
{ id: , name: "", imgUrl: "images" },
{ id: , name: "", imgUrl: "images" },
{ id: , name: "", imgUrl: "images" },
*/



//The "Old" file group
const extraCards = [
  { "id": 1, name: "Aipom", imgUrl: "images/Old/Aipom.MT.70.webp" },
  { "id": 2, name: "Articuno", imgUrl: "images/Old/Articuno.FO.17.webp" },
  { "id": 3, name: "Baltoy", imgUrl: "images/Old/Baltoy.DX.53.webp" },
  { "id": 4, name: "Banette", imgUrl: "images/Old/Banette.HL.1.webp" },
  { "id": 5, name: "Barboach", imgUrl: "images/Old/Barboach.DX.54.webp" },
  { "id": 6, name: "Beedrill", imgUrl: "images/Old/Beedrill.BS.17.webp" },
  { "id": 7, name: "Bill", imgUrl: "images/Old/Bill.BS.91.webp" },
  { "id": 8, name: "Blastoise", imgUrl: "images/Old/Blastoise.BS.2.webp" },
  { "id": 9, name: "Charizard", imgUrl: "images/Old/Charizard.BS.4.webp" },
  { "id": 10, name: "Charmander", imgUrl: "images/Old/Charmander.RG.113.webp" },
  { "id": 11, name: "Chingling", imgUrl: "images/Old/Chingling.MT.42.webp" },
  { "id": 12, name: "Dark-Alakazam", imgUrl: "images/Old/Dark-Alakazam.TR.1.webp" },
  { "id": 13, name: "Dark-Vileplume", imgUrl: "images/Old/Dark-Vileplume.TR.13.webp" },
  { "id": 14, name: "Dewgong", imgUrl: "images/Old/Dewgong.BS.25.webp" },
  { "id": 15, name: "Ditto", imgUrl: "images/Old/Ditto.FO.3.webp" },
  { "id": 16, name: "Dragonair", imgUrl: "images/Old/Dragonair.BS.18.webp" },
  { "id": 17, name: "Dragonite", imgUrl: "images/Old/Dragonite.FO.19.webp" },
  { "id": 18, name: "Dragonite", imgUrl: "images/Old/Dragonite.FO.4.webp" },
  { "id": 19, name: "Dratini", imgUrl: "images/Old/Dratini.BS.26.webp" },
  { "id": 20, name: "Electrode", imgUrl: "images/Old/Electrode.BS.21.webp" },
  { "id": 21, name: "Gyarados", imgUrl: "images/Old/Gyarados.BS.6.webp" },
  { "id": 22, name: "Happiny", imgUrl: "images/Old/Happiny.MT.52.webp" },
  { "id": 23, name: "Haunter", imgUrl: "images/Old/Haunter.BS.29.webp" },
  { "id": 24, name: "Ivysaur", imgUrl: "images/Old/Ivysaur.BS.30.webp" },
  { "id": 25, name: "Lapras", imgUrl: "images/Old/Lapras.FO.25.webp" },
  { "id": 26, name: "Lunatone", imgUrl: "images/Old/Lunatone.DX.36.webp" },
  { "id": 27, name: "Magby", imgUrl: "images/Old/Magby.MT.88.webp" },
  { "id": 28, name: "Magcargo", imgUrl: "images/Old/Magcargo.DX.20.webp" },
  { "id": 29, name: "Manectric", imgUrl: "images/Old/Manectric.DX.38.webp" },
  { "id": 30, name: "Mewtwo", imgUrl: "images/Old/Mewtwo.BS.10.webp" },
  { "id": 31, name: "Minun", imgUrl: "images/Old/Minun.DX.41.webp" },
  { "id": 32, name: "Mismagius", imgUrl: "images/Old/Mismagius.DP.10.webp" },
  { "id": 33, name: "Moltres", imgUrl: "images/Old/Moltres.FO.27.webp" },
  { "id": 34, name: "Ninetales", imgUrl: "images/Old/Ninetales.BS.12.webp" },
  { "id": 35, name: "Numel", imgUrl: "images/Old/Numel.DX.68.webp" },
  { "id": 36, name: "Onix", imgUrl: "images/Old/Onix.BS.56.webp" },
  { "id": 37, name: "Paras", imgUrl: "images/Old/Paras.RG.72.webp" },
  { "id": 38, name: "Plusle", imgUrl: "images/Old/Plusle.DX.44.webp" },
  { "id": 39, name: "Poliwhirl", imgUrl: "images/Old/Poliwhirl.BS.38.webp" },
  { "id": 40, name: "Professor-Oak", imgUrl: "images/Old/Professor-Oak.BS.88.webp" },
  { "id": 41, name: "Raichu", imgUrl: "images/Old/Raichu.BS.14.webp" },
  { "id": 42, name: "Shedinja", imgUrl: "images/Old/Shedinja.DX.14.webp" },
  { "id": 43, name: "Slugma", imgUrl: "images/Old/Slugma.DX.75.webp" },
  { "id": 44, name: "Snover", imgUrl: "images/Old/Snover.MT.101.webp" },
  { "id": 45, name: "Spheal", imgUrl: "images/Old/Spheal.MT.102.webp" },
  { "id": 46, name: "Starmie", imgUrl: "images/Old/Starmie.BS.64.webp" },
  { "id": 47, name: "Tangela", imgUrl: "images/Old/Tangela.BS.66.webp" },
  { "id": 48, name: "Tropius", imgUrl: "images/Old/Tropius.DX.27.webp" },
  { "id": 49, name: "Uxie", imgUrl: "images/Old/Uxie.MT.18.webp" }, 
  { "id": 52, name: "Voltorb", imgUrl: "images/Old/Voltorb.BS.67.webp" },
  { "id": 53, name: "Vulpix", imgUrl: "images/Old/Vulpix.BS.68.webp" },
  { "id": 54, name: "Wailord", imgUrl: "images/Old/Wailord.CEC.46.30765.webp" },
  { "id": 55, name: "Whiscash", imgUrl: "images/Old/Whiscash.DX.28.webp" },
  { "id": 57, name: "Zapdos", imgUrl: "images/Old/Zapdos.BS.16.webp" }
];




/*
//THe High Res Data set for pokemon
[
  { "id": 1, "name": "Blissey", "imgUrl": "images/res/Blissey.SV1EN.145.47199.webp" },
  { "id": 2, "name": "Breloom", "imgUrl": "images/res/Breloom.SV1EN.4.47076.webp" },
  { "id": 3, "name": "Buizel", "imgUrl": "images/res/Buizel.SV1EN.46.47114.webp" },
  { "id": 4, "name": "Cacnea", "imgUrl": "images/res/Cacnea.SV1EN.5.47077.webp" },
  { "id": 5, "name": "Cacturne", "imgUrl": "images/res/Cacturne.SV1EN.6.47078.webp" },
  { "id": 6, "name": "Chansey", "imgUrl": "images/res/Chansey.SV1EN.144.47198.webp" },
  { "id": 7, "name": "Croagunk", "imgUrl": "images/res/Croagunk.SV1EN.130.47187.webp" },
  { "id": 8, "name": "Drifblim", "imgUrl": "images/res/Drifblim.SV1EN.90.47152.webp" },
  { "id": 9, "name": "Drifloon", "imgUrl": "images/res/Drifloon.SV1EN.89.47151.webp" },
  { "id": 10, "name": "Flaaffy", "imgUrl": "images/res/Flaaffy.SV1EN.67.47131.webp" },
  { "id": 11, "name": "Floatzel", "imgUrl": "images/res/Floatzel.SV1EN.47.47115.webp" },
  { "id": 12, "name": "Forretress", "imgUrl": "images/res/Forretress.SV1EN.139.47194.webp" },
  { "id": 13, "name": "Grimer", "imgUrl": "images/res/Grimer.SV1EN.126.47183.webp" },
  { "id": 14, "name": "Houndoom", "imgUrl": "images/res/Houndoom.SV1EN.34.47104.webp" },
  { "id": 15, "name": "Houndour", "imgUrl": "images/res/Houndour.SV1EN.33.47103.webp" },
  { "id": 16, "name": "Kirlia", "imgUrl": "images/res/Kirlia.SV1EN.85.47147.webp" },
  { "id": 17, "name": "Lucario", "imgUrl": "images/res/Lucario.SV1EN.114.47173.webp" },
  { "id": 18, "name": "Mankey", "imgUrl": "images/res/Mankey.SV1EN.107.47167.webp" },
  { "id": 19, "name": "Mareep", "imgUrl": "images/res/Mareep.SV1EN.66.47130.webp" },
  { "id": 20, "name": "Medicham", "imgUrl": "images/res/Medicham.SV1EN.111.47170.webp" },
  { "id": 21, "name": "Meditite", "imgUrl": "images/res/Meditite.SV1EN.110.47169.webp" },
  { "id": 22, "name": "Muk", "imgUrl": "images/res/Muk.SV1EN.127.47184.webp" },
  { "id": 23, "name": "Pachirisu", "imgUrl": "images/res/Pachirisu.SV1EN.68.47132.webp" },
  { "id": 24, "name": "Primeape", "imgUrl": "images/res/Primeape.SV1EN.108.47168.webp" },
  { "id": 25, "name": "Riolu", "imgUrl": "images/res/Riolu.SV1EN.112.47171.webp" },
  { "id": 26, "name": "Seviper", "imgUrl": "images/res/Seviper.SV1EN.128.47185.webp" },
  { "id": 27, "name": "Shroomish", "imgUrl": "images/res/Shroomish.SV1EN.3.47022.webp" },
  { "id": 28, "name": "Slowpoke", "imgUrl": "images/res/Slowpoke.SV1EN.42.47111.webp" },
  { "id": 29, "name": "Spiritomb", "imgUrl": "images/res/Spiritomb.SV1EN.129.47186.webp" },
  { "id": 30, "name": "Starly", "imgUrl": "images/res/Starly.SV1EN.148.47202.webp" },
  { "id": 31, "name": "Torkoal", "imgUrl": "images/res/Torkoal.SM1.23.13585.webp" }
]

*/