let express = require('express'),
  app = express(),
  http = require('http'),
  socketIO = require('socket.io'),
  server, io;

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.sendFile("app");
});

server = http.Server(app);
server.listen(process.env.PORT || 3000);

io = socketIO(server);

//list of rooms, with the players
let rooms = {};

let clientRooms = {}; 

const foods = ["Pizza \u{1F355}",      "Cottage Pie \u{1F967}",   "A Mango \u{1F96D}", "Caviar \u{1F95A}",
               "Pancakes \u{1F95E}",   "Veggie Burger \u{1F354}", "Sushi \u{1F363}",   "Popcorn \u{1F37F}",
               "A Doughnut \u{1F369}", "A Banana \u{1F34C}",      "Cupcake \u{1F9C1}", "falafel \u{1F9C6}",
               "Salad \u{1F957}",      "A Taco \u{1F32E}",        "Butter 1F9C8",      "Peanuts \u{1F95C}"];

//let arrayOfPlayers = []

//when a person loads the website 
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    console.log('message from ' + socket.id + ': ' + msg.message);
    io.emit('message', msg);
  });

  //when a player enters a NEW room/game
  socket.on('new-game', function({ name, roomCode }) {
    console.log("user id: " + socket.id);
    //make a random 6 digit room code 
    console.log("room code: " + roomCode);
    socket.join(roomCode);

    //create a new room object
    rooms[roomCode] = {
      roomCode: roomCode,
      players: [],
      gameStarted: false,
      gameOver: false,
    }

    //add the player object to the room 
    rooms[roomCode].players.push({
      id: socket.id,
      name: name,
      votes: 0,
      imposter: false,
      // message: ""
    });

    console.log("player " + name + " added to room: " + roomCode);
    console.log(rooms);
    console.log(rooms[roomCode].players);

    socket.emit('room-code', roomCode);
    sendPlayerNamesForLobby(roomCode);
    //not printing for first person aka host when he is in 
    //the new room lobby whereas eevryone in the existing room lobby gets the updates
  });

  //when a player JOINS an EXISTING room/game
  socket.on('join-game', function(data) {
    //console log the room code
    console.log(data.code);
    console.log(data.name);
    //join the room
    socket.join(data.code);

    //add the player to the room
    rooms[data.code].players.push({
      id: socket.id,
      name: data.name,
      votes: 0,
      imposter: false,
      // message: ""
    });

    console.log("player " + data.name + " added to room: " + data.code);
    console.log(rooms[data.code].players);

    socket.emit('room-code', data.code);
    sendPlayerNamesForLobby(data.code);
  })

  //when the game is started
  socket.on('start-game', function(data){
    console.log("starting game");
    //io.emit('game-started');
    //emitGameState(roomCode, rooms[roomCode]);
    //emitNextStageToAll(data.code);
    socket.emit('game-started', data.code);
    displayCategoryPageToAll(data.code);
  })

  // socket.on('game-over', function(data){
  //   console.log("game over");
  //   io.emit('game-over');
  // })

  //when voting-start is called, emit the players in the lobby
  // socket.on('voting-start', function(data) {
  //   console.log("voting start");
  //   socket.emit('room-code', data.code);
  //   //sendPlayerNamesForLobby(data.code);
  //   //io.emit('player-names', rooms[data.code].players); //this func doesnt know what playes is
  //   //console.log('player-names');
  //   //getPlayerNamesForVoting(data.code);
  // })

  socket.on('reveal-waiting', function(data) { 
    console.log("reveal waiting");
    // io.emit('reveal-waiting');
    socket.emit('reveal-waiting', data.code);
    displayRevealPlayersPageToAll(data.code);
  })

  socket.on('reveal-item', function(data) {
    console.log("reveal item");
    // io.emit('reveal-item');
    socket.emit('reveal-item', data.code);

    let code = data.code;
    //decide one imposter
    let imposter = rooms[code].players[Math.floor(Math.random() * rooms[code].players.length)];
    imposter.imposter = true;
    //select the food
    let food = foods[Math.floor(Math.random() * foods.length)];

    let object = {
      food: food,
      players: rooms[code].players,
    }

    io.local.emit('roles-reveal-stage', object);
  })

  socket.on('players-ready', function(data) {
    console.log("players ready");
    // io.emit('players-ready');   
    socket.emit('players-ready', data.code);
    console.log(rooms[data.code].players);
    io.local.emit('questions-stage', rooms[data.code].players);
  })

  socket.on('voting-start', function(data) { 
    console.log("voting start");
    socket.emit('voting-start', data.code);
    io.local.emit('voting-start-stage', { players: rooms[data.code].players, code: data.code });
    // io.local.emit('voting-buttons', rooms[data.code].players);
    //sendPlayerNamesForLobby(data.code);
  });

  socket.on('vote', function({ name, code}) {
    //find the player in the room
    let player = rooms[code].players.find(player => player.name === name);
    //increment the votes
    player.votes++;
    //if the amount of votes added up equals the amount of players in the room
    //loop through the players in this room
    let votes = 0; 
    let votedOffPlayer = null;
    let mostVotes = 0;
    for(let i = 0; i < rooms[code].players.length; i++) {
      votes += rooms[code].players[i].votes;
      if(rooms[code].players[i].votes > mostVotes) {
        mostVotes = rooms[code].players[i].votes;
        votedOffPlayer = rooms[code].players[i];
      }
    }

    let imposter = rooms[code].players.find(player => player.imposter === true);

    //if everyone has voted
    if(votes === rooms[code].players.length) {
      //if the imposter has the most votes
      if(votedOffPlayer.imposter) {
        //win
        io.local.emit('score-stage', { won: true, imposter: imposter });
      } else {
        //lose
        io.local.emit('score-stage', { won: false, imposter: imposter });
      }
    }
  });

  socket.on('score-reveal', function(data) {
    console.log("score reveal");
    socket.emit('score-reveal', data.code);
    io.local.emit('score-stage', { players: rooms[data.code].players, code: data.code });
    console.log({ players: rooms[data.code].players, code: data.code });
    io.local.emit('player-names-again', { players: rooms[data.code].players, code: data.code });
  });

  socket.on('chat-message-send', function(data) {
    console.log('message: ' + data.message);
    console.log('room: ' + data.roomCode);
    io.to(data.roomCode).emit('message', data);
  });

});

function sendPlayerNamesForLobby(roomCode) {
  //send the player names to the lobby
  // io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
  io.local.emit('player-names', rooms[roomCode].players);
  // io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
  //console.log(io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players));
  //getPlayerNamesForVoting(roomCode);
}

function displayCategoryPageToAll(roomCode) {
  console.log("displayNextPageToAll called");
  io.local.emit('categories-stage', rooms[roomCode].players);
  // io.local.emit('player-names-again', rooms[roomCode].players);
  // io.sockets.in(roomCode).emit('categories-stage', rooms[roomCode].players);
}

function displayRevealPlayersPageToAll(roomCode) {
  console.log("displayNextPageToAll called");
  io.local.emit('player-roles-stage', rooms[roomCode].players);
  // io.sockets.in(roomCode).emit('categories-stage', rooms[roomCode].players);
}

