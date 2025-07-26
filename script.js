class Card {
  static SUITS = ["♠", "♥", "♦", "♣"];
  static SUIT_NAMES = ["Pique", "Cœur", "Carreau", "Trèfle"];
  static VALUES = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.numericValue = Card.VALUES.indexOf(value) + 1;
  }

  toString() {
    return `${this.value}${Card.SUITS[this.suit]}`;
  }

  getColor() {
    return this.suit === 1 || this.suit === 2 ? "red" : "black";
  }
}

class CardGame {
  constructor() {
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.deck = this.createDeck();
    this.shuffleDeck();
    this.playerCards = this.deck.slice(0, 26);
    this.computerCards = this.deck.slice(26);
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
    this.updateDisplay();
  }

  createDeck() {
    const deck = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let value of Card.VALUES) {
        deck.push(new Card(suit, value));
      }
    }
    return deck;
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  setupEventListeners() {
    document
      .getElementById("play-btn")
      .addEventListener("click", () => this.playRound());
    document
      .getElementById("new-game-btn")
      .addEventListener("click", () => this.newGame());
  }

  playRound() {
    if (
      this.gameOver ||
      this.playerCards.length === 0 ||
      this.computerCards.length === 0
    ) {
      return;
    }

    const playBtn = document.getElementById("play-btn");
    playBtn.disabled = true;

    const playerCard = this.playerCards.shift();
    const computerCard = this.computerCards.shift();

    this.showCards(playerCard, computerCard);

    setTimeout(() => {
      this.determineWinner(playerCard, computerCard);
      this.updateDisplay();

      if (this.playerCards.length === 0 || this.computerCards.length === 0) {
        this.endGame();
      } else {
        playBtn.disabled = false;
      }
    }, 1000);
  }

  showCards(playerCard, computerCard) {
    const playerCardEl = document.getElementById("player-card");
    playerCardEl.className = "card";
    playerCardEl.innerHTML = `
                <div class="card-content">
                    <div class="card-top ${playerCard.getColor()}">${playerCard.toString()}</div>
                    <div class="card-center ${playerCard.getColor()}">${
      Card.SUITS[playerCard.suit]
    }</div>
                    <div class="card-bottom ${playerCard.getColor()}">${playerCard.toString()}</div>
                </div>
            `;

    const computerCardEl = document.getElementById("computer-card");
    computerCardEl.className = "card";
    computerCardEl.innerHTML = `
                <div class="card-content">
                    <div class="card-top ${computerCard.getColor()}">${computerCard.toString()}</div>
                    <div class="card-center ${computerCard.getColor()}">${
      Card.SUITS[computerCard.suit]
    }</div>
                    <div class="card-bottom ${computerCard.getColor()}">${computerCard.toString()}</div>
                </div>
            `;
  }

  determineWinner(playerCard, computerCard) {
    const resultEl = document.getElementById("result");

    if (playerCard.numericValue > computerCard.numericValue) {
      this.playerScore++;
      resultEl.textContent = "🎉 VICTOIRE!";
      resultEl.className = "result win";
    } else if (playerCard.numericValue < computerCard.numericValue) {
      this.computerScore++;
      resultEl.textContent = "😔 Défaite";
      resultEl.className = "result lose";
    } else {
      resultEl.textContent = "🤝 Égalité";
      resultEl.className = "result tie";
    }
  }

  updateDisplay() {
    document.getElementById("player-score").textContent = this.playerScore;
    document.getElementById("computer-score").textContent = this.computerScore;

    const playerProgress = document.getElementById("player-progress");
    const computerProgress = document.getElementById("computer-progress");
    const playerCount = document.getElementById("player-cards-count");
    const computerCount = document.getElementById("computer-cards-count");

    const playerPercent = (this.playerCards.length / 26) * 100;
    const computerPercent = (this.computerCards.length / 26) * 100;

    playerProgress.style.width = playerPercent + "%";
    computerProgress.style.width = computerPercent + "%";
    playerCount.textContent = this.playerCards.length;
    computerCount.textContent = this.computerCards.length;
  }

  endGame() {
    this.gameOver = true;
    document.getElementById("play-btn").disabled = true;

    const modal = document.getElementById("game-over-modal");
    const modalTitle = document.getElementById("modal-title");
    const finalScore = document.getElementById("final-score");

    let title, message;
    if (this.playerScore > this.computerScore) {
      title = "🏆 FÉLICITATIONS! 🏆";
      message = "Vous avez gagné!";
    } else if (this.playerScore < this.computerScore) {
      title = "😢 DÉFAITE 😢";
      message = "L'ordinateur a gagné...";
    } else {
      title = "🤝 ÉGALITÉ 🤝";
      message = "Match nul!";
    }

    modalTitle.textContent = title;
    finalScore.innerHTML = `
                ${message}<br><br>
                <strong>Score final:</strong><br>
                Joueur: ${this.playerScore}<br>
                Ordinateur: ${this.computerScore}
            `;

    modal.classList.add("show");
  }

  newGame() {
    document.getElementById("game-over-modal").classList.remove("show");

    document.getElementById("player-card").innerHTML = `
                <div class="card-content">
                    <div class="card-top">?</div>
                    <div class="card-center">🃏</div>
                    <div class="card-bottom">?</div>
                </div>
            `;

    document.getElementById("computer-card").className = "card face-down";
    document.getElementById("computer-card").innerHTML = "🂠";

    document.getElementById("result").textContent = "";
    document.getElementById("result").className = "result";

    this.init();
    document.getElementById("play-btn").disabled = false;
  }
}

function newGame() {
  game.newGame();
}

const game = new CardGame();

document.addEventListener("DOMContentLoaded", () => {
  const createParticle = () => {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.width = "4px";
    particle.style.height = "4px";
    particle.style.background = "#ffd700";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.top = "-10px";
    particle.style.zIndex = "999";
    particle.style.opacity = "0.7";

    document.body.appendChild(particle);

    let pos = -10;
    const fall = setInterval(() => {
      pos += 2;
      particle.style.top = pos + "px";

      if (pos > window.innerHeight) {
        clearInterval(fall);
        document.body.removeChild(particle);
      }
    }, 50);
  };

  setInterval(createParticle, 3000);
});
