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

const foods = ["Apple", "Banana", "Mango", "Orange"];

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
  socket.on('new-game', function(name) {
    console.log("user id: " + socket.id);
    //make a random 6 digit room code 
    let roomCode = Math.floor(Math.random() * 1000000);
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
      score: 0,
      ready: false,
      imposter: false
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
      score: 0,
      ready: false,
      imposter: false
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
    io.local.emit('voting-start-stage', rooms[data.code].players);
    // io.local.emit('voting-buttons', rooms[data.code].players);
    //sendPlayerNamesForLobby(data.code);
  });

});

function sendPlayerNamesForLobby(roomCode) {
  //send the player names to the lobby
  // io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
  io.local.emit('player-names', rooms[roomCode].players);
  //console.log(io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players));
  //getPlayerNamesForVoting(roomCode);
}

function displayCategoryPageToAll(roomCode) {
  console.log("displayNextPageToAll called");
  io.local.emit('categories-stage', rooms[roomCode].players);
  io.local.emit('player-names-again', rooms[roomCode].players);
}

function displayRevealPlayersPageToAll(roomCode) {
  console.log("displayNextPageToAll called");
  io.local.emit('player-roles-stage', rooms[roomCode].players);
}

