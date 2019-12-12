// @description: App Logic
let cards = document.querySelectorAll(".deck .card");
cards = shuffle(Array.prototype.slice.call(cards));
renderCards(cards);

let playingTime = 0;
let isGameStart = false;
let timer = NaN;

// let timer = setInterval(() => {
//   if (startTimer) {
//     playingTime++;
//     const timer = document.querySelector(".elapsed-time");
//     timer.textContent = `Elapsed Time: ${playingTime}`;
//     console.log(playingTime);
//   }
// }, 1000);

let moves = 0;
let numOfStars = NaN;
const spanMoves = document.querySelector(".moves");
if (spanMoves) spanMoves.textContent = `${moves} Moves`;

// Event Listeneres for cards click event
addHandlers(cards);

const restartBTN = document.querySelector(".restart");
restartBTN.addEventListener("click", evt => window.location.reload());

// @description: Add Event Listeners for cards click event
function addHandlers(cards) {
  if (cards)
    for (const card of cards) {
      card.addEventListener("click", show);
    }
}

function trackTime() {
  isGameStart = true;
  timer = setInterval(() => {
    playingTime++;
    const timer = document.querySelector(".elapsed-time");
    timer.textContent = `Elapsed Time: ${playingTime}`;
    console.log(playingTime);
  }, 1000);
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// @description: render the shuffled cards to the DOM
function renderCards(cards) {
  const deck = document.querySelector(".deck");
  const container = document.createDocumentFragment();

  for (const card of cards) {
    container.appendChild(card);
  }

  deck.innerHTML = "";
  deck.appendChild(container);
}

// @description: Show the symbol of the card
function show(evt) {
  if (!isGameStart) {
    trackTime();
  }
  const card = evt.target.closest(".card");
  if (card) card.removeEventListener("click", show);

  // Count the number of opened cards
  let openedCards = 0;

  for (const c of cards) {
    if (c.className === "card open show") {
      openedCards++;
    }
  }
  // Show the card
  card.classList.add(...["open", "show"]);

  if (openedCards >= 1) {
    moves++;

    match(card, cards);

    const spanMoves = document.querySelector(".moves");

    if (spanMoves) spanMoves.textContent = `${moves} Moves`;

    const starsList = document.querySelector(".stars");

    // Grading the player performance
    if (starsList) {
      starsList.innerHTML = "";
      if (moves <= 10) {
        numOfStars = 3;
      } else if (moves <= 21) {
        numOfStars = 2;
      } else {
        numOfStars = 1;
      }

      // Changing stars icons
      let stars = null;

      if (numOfStars == 1) {
        stars = `
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star-o"></i></li>
        <li><i class="fa fa-star-o"></i></li>
        `;
      } else if (numOfStars == 2) {
        stars = `
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star-o"></i></li>
        `;
      } else if (numOfStars == 3) {
        stars = `
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        `;
      }

      starsList.insertAdjacentHTML("beforeend", stars);
    }
  }
}
// @description: Matching the clicked card with any other exact opened card
function match(card, cards) {
  const icon = card.childNodes[1];
  let openedCard = null;
  let isMatch = false;

  for (const c of cards) {
    if (card != c && c.className === "card open show") {
      openedCard = c;
      if (icon.className === c.childNodes[1].className) {
        card.classList.add("match");
        c.classList.add("match");
        isMatch = true;
        complete();
      }
    }
  }

  if (!isMatch) {
    setTimeout(() => {
      if (openedCard) openedCard.classList.remove(...["open", "show"]);
      card.classList.remove(...["open", "show"]);
    }, 200);
  }

  addHandlers(cards);

  complete();
}

// @description: Restart the game
function restart() {
  let cards = document.querySelectorAll(".card");
  cards = Array.prototype.slice.call(cards);

  for (const card of cards) {
    card.classList.remove(...["open", "show", "match"]);
  }
}

function clearTimer(timer) {
  clearInterval(timer);
  return timer;
}

// @description: Render the complete view to the user
function complete() {
  let cards = document.querySelectorAll(".card");
  cards = Array.prototype.slice.call(cards);

  matchedCards = 0;
  for (const c of cards) {
    if (c.className === "card open show match") {
      matchedCards++;
    }
  }

  if (matchedCards == 16) {
    clearTimer(timer);
    const modal = document.querySelector(".modal");
    const timeElement = document.querySelector(".modal-time");
    const movesElement = document.querySelector(".modal-moves");
    const starElement = document.querySelector(".modal-star-rating");

    timeElement.textContent = `Elapsed time: ${playingTime}`;
    movesElement.textContent = `Number of moves: ${moves}`;
    starElement.textContent = `Star rating: ${numOfStars}`;

    modal.classList.remove("hide");
  }
}
