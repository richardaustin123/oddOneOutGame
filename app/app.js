const socket = io("http://localhost:3000/");

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
// let categoryButton = document.getElementById("category-button");

let hideContent = "none";
let showContent = "block";


newGamebutton.addEventListener("click", () => { 
    console.log("new game button clicked");
    handleGameButtonClick(hideContent, showContent, hideContent);
    let playerName = name.value;
    socket.emit("new-game", playerName);
    // redirect user to lobby.html
});

joinGamebutton.addEventListener("click", () => { 
    console.log("join game button clicked");
    handleGameButtonClick(hideContent, showContent, hideContent);
    //grab the value from the input
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    socket.emit("join-game", {code : roomCodeValue, name : playerName});
});

startGameButton.addEventListener("click", () => {
    console.log("start game button clicked");
    handleGameButtonClick(hideContent, hideContent, showContent);
    socket.emit("start-game");
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
    for(let i = 0; i < data.length; i++) {
        console.log(data[i].name);
        let p = document.createElement("p");
        p.innerHTML = `${i}. ${data[i].name}`;
        playerList.appendChild(p);
    }
});

function handleGameButtonClick(chooseGameStyle, lobbyStyle, gameStyle) {
    console.log("game button clicked");
    chooseGameDiv.style.display = chooseGameStyle;
    lobbyDiv.style.display = lobbyStyle;
    gamePage.style.display = gameStyle;
}

