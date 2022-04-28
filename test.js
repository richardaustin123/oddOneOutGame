//const { all } = require("express/lib/application");

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

///////////////////////////////////////////////////
/////////////////////////////////////////////////////

const foods = ["Apple", "Banana", "Mango", "Orange"];
const players = [];
const questions = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];
const pairArray = [];

const player1 = {name: "Ali", food: ""};
players.push(player1);
const player2 = {name: "Sam", food: ""};
players.push(player2);
const player3 = {name: "Richard", food: ""};
players.push(player3);
const player4 = {name: "Anas", food: ""};
players.push(player4);
const player5 = {name: "Leah", food: ""};
players.push(player5);
const player6 = {name: "Mason", food: ""};
players.push(player6);

socket.on('players', data => {
    console.log("lobby names: " + data);
    //for each person in the lobby, create a p element in the list
    for(let i = 1; i <= data.length; i++) {
        console.log(data[i-1].name);
        // let p = document.createElement("p");
        // p.innerHTML = `${i}. ${data[i-1].name}`;//number of person + name
        // playerList.appendChild(p); //add number and name to the list of players
        players.push(data[i-1].name);
        console.log(players);
    }
});



let playerReveal = document.getElementById("playerReveal");
let playerPlay = document.getElementById("playerPlay");
let food = document.getElementById("food");
let fooditem = randomFood();
let ask = document.getElementById("playerAsk");
let asked = document.getElementById("playerAsked");
let question = document.getElementById("question");



////HARD CODED BUTTONS/////////////////////
let btn1 = document.getElementById("button1");
let btn2 = document.getElementById("button2");
let btn3 = document.getElementById("button3");
let btn4 = document.getElementById("button4");
let btn5 = document.getElementById("button5");
let btn6 = document.getElementById("button6");
/////////////////////////////////////////


//////////////////////////////////////////////////
///////////////////////////////////////////////////

let hideContent = "none";
let showContent = "block";

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
    handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    socket.emit("start-game", {code : roomCodeValue, name : playerName});
    //socket.emit("start-game");
});

// categoryButton.addEventListener("click", () => { 
//     console.log("category button clicked");
//     // let roomCodeValue = roomCode.value;
//     let playerName = name.value;
//     handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
//     socket.emit("reveal-waiting", playerName);

// });
categoryButton.addEventListener("click", () => { 
    console.log("category button clicked");
    // let roomCodeValue = roomCode.value;
//
let roomCodeValue = roomCode.value;
let playerName = name.value;
    // let playerName = player1.name;
     playerPlay.innerHTML = playerName;
//
    handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
    
    socket.emit("reveal-waiting",  {code : roomCodeValue, name : playerName});
});

// revealItemButton.addEventListener("click", () => {
//     console.log("reveal item button clicked");
//     let playerName = name.value;
//     handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
//     socket.emit("reveal-item", playerName);
// });
revealItemButton.addEventListener("click", () => {
    console.log("reveal item button clicked");
//
    let playerName = name.value;
    //let playerName = player1.name;
    playerReveal.innerHTML = playerName;
//
    players.food = fooditem; //sets all players food to foodItem
    randomImposter();//Picks an imposter when reveal button is pressed and changes food to Imposter for that player
    for(i=0; i<players.length; i++)
    {
        if (players[i].food != "Imposter") //Displays food to players that dont have imposter
        {
            food.innerHTML = fooditem;
        }
        else //displays to player that has imposter
        {
            food.innerHTML = "You are the Imposter";
        }
    }
    console.log(playerName);
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
    socket.emit("reveal-item", playerName);
});

// readyButton.addEventListener("click", () => {
//     console.log("ready button clicked");
//     let playerName = name.value;
//     handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
//     socket.emit("players-ready", playerName);
// });

readyButton.addEventListener("click", () => {
    console.log("ready button clicked");
//
    // let playerName = name.value;
    let playerName = player1.name;
//
    let playerasked = pairs();
    
    ask.innerHTML = playerName;
    asked.innerHTML = playerasked;
    question.innerHTML = randomQuestion();

    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
    socket.emit("players-ready", playerName);
});

nextQuestionButton.addEventListener("click", () => {
    console.log("next question button clicked");
    let playerName = name.value;

    ///////HARD CODED BUTTONS//////////////////////
    btn1.innerHTML = player1.name;
    btn2.innerHTML = player2.name;
    btn3.innerHTML = player3.name;
    btn4.innerHTML = player4.name;
    btn5.innerHTML = player5.name;
    btn6.innerHTML = player6.name;

    
    ///////////////////////////////////////////////

    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
    socket.emit("voting-start", playerName);
});

playAgainButton.addEventListener("click", () => {
    console.log("play again button clicked"); 
    handleGameButtonClick(showContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent); 
});


////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function randomFood()
{
    var foodItem = foods[Math.floor(Math.random() * foods.length)]; 
    return foodItem;
}

function randomImposter()
{
    var imp = players[Math.floor(Math.random() * players.length)];
    imp.food = "Imposter";
    return imp;
}

function pairs()
{
    for(i=0; i<players.length; i++)
    {
        if(players[i+1] != null)
        {
            return players[i+1].name;
        }
        else
        {
            return players[0].name;
        }
    }
}

function randomQuestion()
{
    return questions[Math.floor(Math.random() * questions.length)];
}

//Voting Functions
function NoOfVotes() {
    var numberOfVotes = 0;
    for (var i = 0; i < players.length; i++) {
        numberOfVotes = numberOfVotes + players[i].votes;
    }
    return numberOfVotes;
}

function VoteFor(string) {
    if (NoOfVotes() < Players.length) {
        for (var i = 0; i < Players.length; i++) {
            if (string == Players[i].name) {
                Players[i].votes = Players[i].votes + 1;
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


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

socket.on('getplayerlist', data => {
    let playerName = name.value;
    // //let playerName = player1.name;
    playerPlay.innerHTML = playerName;
    // for(let i = 1; i <= data.length; i++) {
    //     playPlay.innerHTML = 
    // }
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