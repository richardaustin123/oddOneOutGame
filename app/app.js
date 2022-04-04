const socket = io("http://localhost:3000/");

console.log("server started");

let btn = document.getElementById("send");
let newGamebutton = document.getElementById("new-game-button");
let joinGamebutton = document.getElementById("join-game-button");
let chooseGameDiv = document.getElementById("choose-game");
let lobbyDiv = document.getElementById("lobby-content");
let roomCode = document.getElementById("room-code");
let message = document.getElementById("msg");
let roomCodeHeader = document.getElementById("room-code-header");
let startGameButton = document.getElementById("start-game-button");
let gamePage = document.getElementById("game-page");
// let categoryButton = document.getElementById("category-button");

let hideContent = "none";
let showContent = "block";


newGamebutton.addEventListener("click", () => { 
    console.log("new game button clicked");
    handleGameButtonClick(hideContent, showContent, hideContent);
    socket.emit("new-game");
    // redirect user to lobby.html
});

joinGamebutton.addEventListener("click", () => { 
    console.log("join game button clicked");
    handleGameButtonClick(hideContent, showContent, hideContent);
    //grab the value from the input
    let roomCodeValue = roomCode.value;
    socket.emit("join-game", roomCodeValue);
});

startGameButton.addEventListener("click", () => {
    console.log("start game button clicked");
    handleGameButtonClick(hideContent, hideContent, showContent);
    socket.emit("start-game");
});

btn.onclick = () => {
    let val = message.value; // value of the input
    console.log(val); // print value of the input
    // alert(`Your message: ${val}`);
    socket.emit('chat message', {
        message : val,
    });
};

socket.on('message', data => {
    let p = document.createElement("p");
    p.innerHTML = data.message;
    document.body.appendChild(p);
});

socket.on('room-code', data => {
    console.log("room code: " + data);
    roomCodeHeader.innerHTML = data;
});



function handleGameButtonClick(chooseGameStyle, lobbyStyle, gameStyle) {
    console.log("game button clicked");
    chooseGameDiv.style.display = chooseGameStyle;
    lobbyDiv.style.display = lobbyStyle;
    gamePage.style.display = gameStyle;
}

