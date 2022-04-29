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
let playerListAgain = document.getElementById("playerlist");
let playerPlay = document.getElementById("player-play");
let playerNamesButton = document.getElementById("player-names-button");
let playerButtons = document.getElementById("player-buttons");
let playerReveal = document.getElementById("player-reveal");
let food = document.getElementById("food");
let ask = document.getElementById("player-ask");
let asked = document.getElementById("player-asked");
let question = document.getElementById("question");

const foods = ["Apple", "Banana", "Mango", "Orange"];
const players = ["",""];
const questions = ["What would you do if you had to eat this for the rest of your life?",
"Could you see this being served in School cafeteria?",
"Do you think you could make a milkshake with this?",
"How many of these could you fit in your mouth at once?",
"Would you consider this food as a necessity?",
"How long could you walk for on a hike whilst wearing shoes made from this food?",
"How many of theses would you be able to eat before you vomit?",
"If you were stranded on an island and all you had were rotten versions of this, would you eat it?",
"Could you see a game created with the main character being made of this food?",
"Would you eat this as a topping on pizza?"];
const pairArray = [];
// let fooditem = randomFood();

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

socket.on('player-names-again', data => {
    console.log("lobby names: " + data);
    playerListAgain.innerHTML = "";
    // playerPlay.innerHTML = "";
    //for each person in the lobby, create a p element in the list
    for(let i = 1; i <= data.length; i++) {
        console.log(data[i-1].name);
        let p = document.createElement("p");
        p.innerHTML = `${i}. ${data[i-1].name}`;//number of person + name
        playerListAgain.appendChild(p); //add number and name to the list of players
        //playerPlay.innerHTML = `${i}. ${data[i-1].name}`;
    }
});

socket.on('categories-stage', data => {
    handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
});

socket.on('player-roles-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
    // let roomCodeValue = roomCode.value;
    let playerName = name.value;
    // let playerName = player1.name;
     playerPlay.innerHTML = playerName;
});

socket.on('roles-reveal-stage', data => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
    let playerName = name.value;
    //let playerName = player1.name;
    playerReveal.innerHTML = playerName;

    let fooditem = randomFood();
    data.food = fooditem; //sets all players food to foodItem
    randomImposter();//Picks an imposter when reveal button is pressed and changes food to Imposter for that player
    for(i=0; i<data.length; i++)
    {
        if (data[i].food != "Imposter") //Displays food to players that dont have imposter
        {
            // document.getElementById("imposter-or-not").innerHTML = "You are not the imposter";
            food.innerHTML = "Your item: " + fooditem;
        }
        else //displays to player that has imposter
        {
            food.innerHTML = "You are the Imposter";
        }
    }

    function randomFood(){
        var foodItem = foods[Math.floor(Math.random() * foods.length)]; 
        return foodItem;
    }

    function randomImposter() {
        var imp = data[Math.floor(Math.random() * data.length)];
        console.log(food);
        imp.food = "Imposter";
        return imp;
    }
});

socket.on('questions-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);

    let playerName = name.value;
    // let playerName = player1.name;
    let playerasked = playerAaskPlayerB();
    
    ask.innerHTML = playerName + " ask:";
    asked.innerHTML = playerasked;
    question.innerHTML = randomQuestion();

    function pairs() {
        // for(i=0; i<data.length; i++)
        // {
        //     if(data[i+1] != null)
        //     {
        //         return data[i+1].name;
        //     }
        //     else
        //     {
        //         return data[0].name;
        //     }
        // }
    }

    //loop through players and pick a random player to ask 
    function playerAaskPlayerB() {
        //let hasPlayerBeenAsked = false;
        let alreadyBeenAsked = [];

        for(i=0; i<data.length; i++) {
            //get a random player that isn't playerName and that isnt in the alreadyBeenAsked array, when selected add them to array
            if(data[i].name != playerName && alreadyBeenAsked.indexOf(data[i].name) == -1) {
                alreadyBeenAsked.push(data[i].name);
                return data[i].name;
            }
        }
    }

    


    function randomQuestion() {
        return questions[Math.floor(Math.random() * questions.length)];
    }
});

socket.on('voting-start-stage', data => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
    
    playerButtons.innerHTML = "";
    //for each person in the lobby, create a button element in the list and make a line break after each button
    for(let i = 1; i <= data.length; i++) {
        console.log(data[i-1].name);
        let button = document.createElement("button");
        button.innerHTML = `${i}. ${data[i-1].name}`;//number of person + name
        button.setAttribute("id", `vote-button${i}`);
        button.setAttribute("class", "button-class");
        playerButtons.appendChild(button); //add number and name to the list of players
        playerButtons.appendChild(document.createElement("br"));

        //for every button made, if the button is clicked, keep a count of votes and display the count for each player
        // button.addEventListener("click", function() {
        //     let voteCount = document.getElementById(`vote-button${i}`).innerHTML;
        //     console.log(voteCount);
        //     document.getElementById(`vote-button${i}`).innerHTML = voteCount + 1;
        // });

        // for(i=0; i<data.length; i++) {
        //     //get the button element for each button
        //     document.getElementById(`vote-button${i}`);

        // }
    }
    

    function NoOfVotes() {
        var numberOfVotes = 0;
        for (var i = 0; i < data.length; i++) {
            numberOfVotes = numberOfVotes + data[i].votes;
        }
        return numberOfVotes;
    }
    
    function VoteFor(string) {
        if (NoOfVotes() < data.length) {
            for (var i = 0; i < data.length; i++) {
                if (string == data[i].name) {
                    data[i].votes = data[i].votes + 1;
                }
            }
        }
    }
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

// function randomFood()
// {
//     var foodItem = foods[Math.floor(Math.random() * foods.length)]; 
//     return foodItem;
// }

// function randomImposter()
// {
//     var imp = players[Math.floor(Math.random() * players.length)];
//     console.log(food);
//     imp.food = "Imposter";
//     return imp;
// }

// function handleGameState(gameState) {
//     console.log("game state: " + gameState);
//     if(gameState) {
//         handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
//         //socket.emit
//     } else {
//         handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
//     }
// }