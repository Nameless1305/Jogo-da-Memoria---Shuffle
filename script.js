const cardsArray = [
    {name: "A", img: "A"},
    {name: "A", img: "A"},
    {name: "B", img: "B"},
    {name: "B", img: "B"},
    {name: "C", img: "C"},
    {name: "C", img: "C"},
    {name: "D", img: "D"},
    {name: "D", img: "D"},
    {name: "E", img: "E"},
    {name: "E", img: "E"},
    {name: "F", img: "F"},
    {name: "F", img: "F"},
    {name: "G", img: "G"},
    {name: "G", img: "G"},
    {name: "H", img: "H"},
    {name: "H", img: "H"},
    {name: "I", img: "I"},
    {name: "I", img: "I"},
    {name: "J", img: "J"},
    {name: "J", img: "J"},
];

//EMBARALHA AS CARTAS
cardsArray.sort(() => 0.5 - Math.random());

//SONS
const clickSound = new Audio("audio/click.mp3");
const matchSound = new Audio("audio/match.mp3");
const winSound = new Audio("audio/win.mp3");

//CONTABILIZAR ACERTOS
let matchedPairs = 0;
const totalPairs = cardsArray.length / 2;

//RENDERIZAR AS CARTAS NO TABULEIRO
const gameBoard = document.querySelector("#game-board");

cardsArray.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card.name;
    cardElement.innerText = "?";
    gameBoard.appendChild(cardElement);
});

//CRIANDO A LÓGICA DO JOGO
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;

    clickSound.currentTime = 0; // Reinicia o som para toques rápidos
    clickSound.play(); // Toca o som

    this.classList.add("card-flipped");
    this.innerText = this.dataset.name;

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch(){
    if(firstCard.dataset.name === secondCard.dataset.name){
        matchSound.currentTime = 0;
        matchSound.play();
        disableCards();
    } else {
        unflipCard();
    }
}

function disableCards(){
    //MARCA AS CARTAS QUE O JOGADOR JÁ ACERTOU
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matchedPairs++;

    if (matchedPairs === totalPairs) {
        winSound.play();
    }

    resetBoard();
}

function unflipCard(){
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("card-flipped");
        secondCard.classList.remove("card-flipped");
        firstCard.innerText = "?";
        secondCard.innerText = "?";

        resetBoard();
        secondCard.innerText = "?";
    }, 500);
}

function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

document.querySelectorAll(".card").forEach(card => card.addEventListener("click", flipCard));

function restartGame() {
    // Limpa o tabuleiro
    gameBoard.innerHTML = "";

    cardsArray.sort(() => 0.5 - Math.random());

    cardsArray.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.name = card.name;
        cardElement.innerText = "?";
        gameBoard.appendChild(cardElement);
    });

    // Reseta o estado do jogo
    resetBoard();

    // Adiciona eventos novamente
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", flipCard));
}

document.getElementById("restart-button").addEventListener("click", restartGame);

//FUNÇÃO PARA EMBARALHAR SOMENTE AS CARTAS QUE O JOGADOR AINDA NÃO ACERTOU
function shuffleUnmatchedCards() {
    const allCards = [...document.querySelectorAll('.card')];
    const unmatchedCards = allCards.filter(card => !card.classList.contains('matched'));

    // Captura os dados das cartas não acertadas
    const unmatchedData = unmatchedCards.map(card => card.dataset.name);

    // Embaralha os nomes
    for (let i = unmatchedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unmatchedData[i], unmatchedData[j]] = [unmatchedData[j], unmatchedData[i]];
    }

    // Atualiza o conteúdo das cartas não acertadas
    unmatchedCards.forEach((card, index) => {
        card.dataset.name = unmatchedData[index];
        card.innerText = "?";
        card.classList.remove("card-flipped");
    });

    // Reseta a lógica do tabuleiro caso o jogador esteja no meio de uma jogada
    resetBoard();
}
setInterval(() => {
    shuffleUnmatchedCards();
}, 5000); // a cada 10 segundos