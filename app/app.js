    const socket = io("http://localhost:3000/");
// const socket = io("https://oddoneoutgame.herokuapp.com/");

console.log("server started");

let newGamebutton = document.getElementById("new-game-button");
let joinGamebutton = document.getElementById("join-game-button");
let chooseGameDiv = document.getElementById("choose-game");
let lobbyDiv = document.getElementById("lobby-content");
let roomCode = document.getElementById("room-code");
let message = document.getElementById("msg");
let roomCodeHeader = document.getElementById("room-code-header");
let startGameButton = document.getElementById("start-game-button");
let gamePage = document.getElementById("game-page");
let playerList = document.getElementById("players");
let name = document.getElementById("name");
let votingDiv = document.getElementById("voting-page");
let categoryButton = document.getElementById("category-game-button");
let playDiv = document.getElementById("play-page");
let revealItemButton = document.getElementById("reveal-item-button");
let revealItemDiv = document.getElementById("reveal-item-page");
let readyButton = document.getElementById("ready-button");
let questionsDiv = document.getElementById("questions-page");
let nextQuestionButton = document.getElementById("next-question-button");
let playAgainButton = document.getElementById("play-again-button");

let hideContent = "none";
let showContent = "block";

//let gameState = false;

//start new game on click
newGamebutton.addEventListener("click", () => { 
    console.log("new game button clicked");
    //hide choosegame css, show lobby css, hide game css, hide voting css
    handleGameButtonClick(hideContent, showContent, hideContent, hideContent, hideContent, hideContent, hideContent); 
    let playerName = name.value;
    socket.emit("new-game", playerName);
});

joinGamebutton.addEventListener("click", () => { 
    console.log("join game button clicked");
    //if the code is greater than 0 and a number
    let roomCodeValue = roomCode.value;
    if(roomCodeValue.length > 0 && !isNaN(roomCodeValue)){
        handleGameButtonClick(hideContent, showContent, hideContent, hideContent, hideContent, hideContent, hideContent);
        let playerName = name.value;
        socket.emit("join-game", {code : roomCodeValue, name : playerName});
    } else {
        alert("Please enter a valid room code");
    }
});

startGameButton.addEventListener("click", () => {
    console.log("start game button clicked");
    //handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    socket.emit("start-game", {code : roomCodeValue, name : playerName});
    //socket.emit("start-game");
    //gameState = true;
});

categoryButton.addEventListener("click", () => { 
    console.log("category button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
    socket.emit("reveal-waiting", {code : roomCodeValue, name : playerName});
});

revealItemButton.addEventListener("click", () => {
    console.log("reveal item button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
    socket.emit("reveal-item", {code : roomCodeValue, name : playerName});
});

readyButton.addEventListener("click", () => {
    console.log("ready button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
    socket.emit("players-ready", {code : roomCodeValue, name : playerName});
});

nextQuestionButton.addEventListener("click", () => {
    console.log("next question button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
    socket.emit("voting-start", {code : roomCodeValue, name : playerName});
});

playAgainButton.addEventListener("click", () => {
    console.log("play again button clicked"); 
    handleGameButtonClick(showContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent); 
});



// btn.onclick = () => {
//     let val = message.value; // value of the input
//     console.log(val); // print value of the input
//     // alert(`Your message: ${val}`);
//     socket.emit('chat message', {
//         message : val,
//     });
// };

socket.on('message', data => {
    let p = document.createElement("p");
    p.innerHTML = data.message;
    document.body.appendChild(p);
});

socket.on('room-code', data => {
    console.log("room code: " + data);
    roomCodeHeader.innerHTML = data;
});

//get the names of people in the lobby 
socket.on('player-names', data => {
    console.log("lobby names: " + data);
    playerList.innerHTML = "";
    //for each person in the lobby, create a p element in the list
    for(let i = 1; i <= data.length; i++) {
        console.log(data[i-1].name);
        let p = document.createElement("p");
        p.innerHTML = `${i}. ${data[i-1].name}`;//number of person + name
        playerList.appendChild(p); //add number and name to the list of players
    }
});

socket.on('categories-stage', data => {
    handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
});

socket.on('player-roles-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
});

socket.on('roles-reveal-stage', data => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
});

socket.on('players-ready-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
});

socket.on('voting-start-stage', data => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
});

// socket.on('')

// socket.on('gameState', data => {
//     data = JSON.parse(data);
// });

function handleGameButtonClick(chooseGameStyle, lobbyStyle, gameStyle, playStyle, revealItemStyle, questionsStyle, votingStyle) {
    console.log("game button clicked");
    chooseGameDiv.style.display = chooseGameStyle;
    lobbyDiv.style.display = lobbyStyle;
    gamePage.style.display = gameStyle;
    playDiv.style.display = playStyle;
    revealItemDiv.style.display = revealItemStyle;
    questionsDiv.style.display = questionsStyle;
    votingDiv.style.display = votingStyle;
}

// function handleGameState(gameState) {
//     console.log("game state: " + gameState);
//     if(gameState) {
//         handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
//         //socket.emit
//     } else {
//         handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
//     }
// }