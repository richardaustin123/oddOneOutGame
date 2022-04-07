// const socket = io("http://localhost:3000/");
const socket = io("https://oddoneoutgame.herokuapp.com/");

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

let hideContent = "none";
let showContent = "block";

//start new game on click
newGamebutton.addEventListener("click", () => { 
    console.log("new game button clicked");
    //hide choosegame css, show lobby css, hide game css, hide voting css
    handleGameButtonClick(hideContent, showContent, hideContent, hideContent); 
    let playerName = name.value;
    socket.emit("new-game", playerName);
});

joinGamebutton.addEventListener("click", () => { 
    console.log("join game button clicked");
    //if the code is greater than 0 and a number
    let roomCodeValue = roomCode.value;
    if(roomCodeValue.length > 0 && !isNaN(roomCodeValue)){
        handleGameButtonClick(hideContent, showContent, hideContent, hideContent);
        let playerName = name.value;
        socket.emit("join-game", {code : roomCodeValue, name : playerName});
    } else {
        alert("Please enter a valid room code");
    }
});

startGameButton.addEventListener("click", () => {
    console.log("start game button clicked");
    handleGameButtonClick(hideContent, hideContent, showContent, hideContent);
    socket.emit("start-game");
});

categoryButton.addEventListener("click", () => { 
    console.log("category button clicked");
    // let roomCodeValue = roomCode.value;
    let playerName = name.value;
    handleGameButtonClick(hideContent, hideContent, hideContent, showContent);
    socket.emit("voting-start", playerName);

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
        p.innerHTML = `${i}. ${data[i].name}`;//number of person + name
        playerList.appendChild(p); //add number and name to the list of players
    }
});

function handleGameButtonClick(chooseGameStyle, lobbyStyle, gameStyle, votingStyle) {
    console.log("game button clicked");
    chooseGameDiv.style.display = chooseGameStyle;
    lobbyDiv.style.display = lobbyStyle;
    gamePage.style.display = gameStyle;
    votingDiv.style.display = votingStyle;
}