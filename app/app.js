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
let yourItemIs = document.getElementById("your-item-is");
let ask = document.getElementById("player-ask");
let asked = document.getElementById("player-asked");
let question = document.getElementById("question");
let scoresDiv = document.getElementById("scores-page");
// let ontoScoresButton = document.getElementById("onto-scores-button");
let imposterReveal = document.getElementById("imposter-reveal");
let howToPlayButton = document.getElementById("how-to-play-button");
let howToPlayDiv = document.getElementById("how-to-instructions");

const foods = ["Pizza \u{1F355}", "Cottage Pie", "A Mango \u{1F96D}", "Caviar \u{1F95A}", "Pancakes \u{1F95E}", "Veggie Burger \u{1F354}"];
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
"Would you eat this as a topping on pizza?",
"Could you wield this as a weapon in a 1v1 duel?",
"Could you make a house out of this?",
"How likely are you to recommend this food to someone?",
"How many of this food would you be able to eat in a day?",
"Would you want to be sponsored by this food?",
"How would you feel if this item of food became one universal currency for the entire world?",
"If this food was used for the design of a new Pokémon, would you consider consuming said Pokémon?",
"Does this food cure depression for the world?",
"Could you see this being made into a flavour of ice cream?",
"Could this food be used as new type of bioenergy for cars in the near future? And if not, why?",
"Could this food be used as the logo for extremist propaganda?",
"A new law states you can only eat this food between two pieces of bread. Would you be happy to eat this as a sandwich?",
"Coukd you kill a vapire with this food?"];
const pairArray = [];
// let fooditem = randomFood();

let hideContent = "none";
let showContent = "block";

let globalPlayerName = "";
let globalRoomCode = 0;

//let gameState = false;

//start new game on click
newGamebutton.addEventListener("click", () => { 
    console.log("new game button clicked");
    //hide choosegame css, show lobby css, hide game css, hide voting css
    let playerName = name.value;
    let roomCode = Math.floor(Math.random() * 1000000);
    globalRoomCode = roomCode;
    if(playerName === "") {
        alert("Please enter a name");
    } else {
        handleGameButtonClick(hideContent, showContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent); 
        globalPlayerName = playerName;
        socket.emit("new-game", {name: playerName, roomCode: roomCode});
    }
});

joinGamebutton.addEventListener("click", () => { 
    console.log("join game button clicked");
    let playerName = name.value;
    //if the code is greater than 0 and a number
    let roomCodeValue = roomCode.value;
    globalRoomCode = roomCodeValue;
    if(roomCodeValue.length > 0 && !isNaN(roomCodeValue)){
        if(playerName === "") {
            alert("Please enter a name");
        } else {
            handleGameButtonClick(hideContent, showContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent);
            globalPlayerName = playerName;
            socket.emit("join-game", {code : roomCodeValue, name : playerName});
        }
    } else {
        alert("Please enter a valid room code");
    }
});

howToPlayButton.addEventListener("click", () => {
    //show the howToPlayDiv
    if(howToPlayDiv.style.display === hideContent) {
        howToPlayDiv.style.display = showContent;
    } else {
        howToPlayDiv.style.display = hideContent;
    }
});

startGameButton.addEventListener("click", () => {
    console.log("start game button clicked");
    //handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    console.log(roomCodeValue);
    socket.emit("start-game", {code : globalRoomCode, name : playerName});
    //socket.emit("start-game");
    //gameState = true;
});

categoryButton.addEventListener("click", () => { 
    console.log("category button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
    socket.emit("reveal-waiting", {code : globalRoomCode, name : playerName});
});

revealItemButton.addEventListener("click", () => {
    console.log("reveal item button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);
    socket.emit("reveal-item", {code : globalRoomCode, name : playerName});
});

readyButton.addEventListener("click", () => {
    console.log("ready button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
    socket.emit("players-ready", {code : globalRoomCode, name : playerName});
});

nextQuestionButton.addEventListener("click", () => {
    console.log("next question button clicked");
    let roomCodeValue = roomCode.value;
    let playerName = name.value;
    //handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
    socket.emit("voting-start", {code : globalRoomCode, name : playerName});
});

// ontoScoresButton.addEventListener("click", () => {
//     console.log("onto scores button clicked");
//     let roomCodeValue = roomCode.value;
//     let playerName = name.value;
//     socket.emit("score-reveal", {code : globalRoomCode, name : playerName});
// });

playAgainButton.addEventListener("click", () => {
    console.log("play again button clicked"); 
    handleGameButtonClick(showContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent); 
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
    handleGameButtonClick(hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent, hideContent);
});

socket.on('player-roles-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent, hideContent);
    // let roomCodeValue = roomCode.value;
    let playerName = name.value;
    // let playerName = player1.name
     playerPlay.innerHTML = playerName;
});

socket.on('roles-reveal-stage', data => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent, hideContent);
    let playerName = name.value;
    //let playerName = player1.name;
    playerReveal.innerHTML = playerName;

   let selectedFood = data.food;
   let players = data.players;
   
   //check if this player is an imposter
   players.forEach(player => {
       if(player.name === globalPlayerName){
           if(player.imposter == true){
                //if this player is an imposter, show the food they were selected
                selectedFood = "Imposter!";
            } else {
                yourItemIs.innerHTML = "Your item is: ";
            }
        }
    })
    
    food.innerHTML = selectedFood;
});

socket.on('questions-stage', data => { 
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent, hideContent);

    let playerasked = "";

    data.forEach(function(player, index, theArray) {
        console.log(player.name);
        if(player.name == globalPlayerName){
            //pick next player, wrap around
            if(index == theArray.length - 1){
                playerasked = theArray[0].name;
            }
            else{
                playerasked = theArray[index+1].name;
            }
        }
    });
    
    ask.innerHTML = globalPlayerName + " ask:";
    asked.innerHTML = playerasked;
    question.innerHTML = randomQuestion();

    function randomQuestion() {
        return questions[Math.floor(Math.random() * questions.length)];
    }
});

socket.on('voting-start-stage', ({ players, code }) => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent, hideContent);
    
    playerButtons.innerHTML = "";
    //for each person in the lobby, create a button element in the list 
    for(let i = 1; i <= players.length; i++) {
        console.log(players[i-1].name);
        let button = document.createElement("button");
        button.innerHTML = `${i}. ${players[i-1].name}`;//number of person + name
        button.setAttribute("id", `${players[i-1].name}`);
        button.setAttribute("class", "button-class");
        playerButtons.appendChild(button); //add number and name to the list of players
        button.onclick = () => {
            socket.emit("vote", {name : players[i-1].name, code : code});
            console.log(players[i-1].name + " vote button pressed");
        }
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

socket.on('score-stage', ({ won, imposter }) => {
    handleGameButtonClick(hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, hideContent, showContent);
    //if the imposter was voted correctly in server, reveal the imposter and say they were correct, else reveal imposter and say they were incorrect
    if(won){
        imposterReveal.innerHTML = "You guessed correct! <br>" + imposter.name + " was the imposter!";
    } else {
        imposterReveal.innerHTML = "You guessed incorrect! <br> " + imposter.name + " was the imposter!";
    }
});


function handleGameButtonClick(chooseGameStyle, lobbyStyle, gameStyle, playStyle, revealItemStyle, questionsStyle, votingStyle, scoresStyle) {
    console.log("game button clicked");
    chooseGameDiv.style.display = chooseGameStyle;
    lobbyDiv.style.display = lobbyStyle;
    gamePage.style.display = gameStyle;
    playDiv.style.display = playStyle;
    revealItemDiv.style.display = revealItemStyle;
    questionsDiv.style.display = questionsStyle;
    votingDiv.style.display = votingStyle;
    scoresDiv.style.display = scoresStyle;
}

//hello 

