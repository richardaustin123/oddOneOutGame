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
    });

    console.log("player " + data.name + " added to room: " + data.code);
    console.log(rooms[data.code].players);

    socket.emit('room-code', data.code);
    sendPlayerNamesForLobby(data.code);
  })

  //when the game is started
  socket.on('start-game', function(){
    console.log("starting game");
    io.emit('game-started');
  })

  //when voting-start is called, emit the players in the lobby
  socket.on('voting-start', function(data) {
    console.log("voting start");
    //io.emit('player-names', rooms[data.code].players); //this func doesnt know what playes is
    //console.log('player-names');
    getPlayerNamesForVoting(data.code);
  })

});

function sendPlayerNamesForLobby(roomCode) {
  //send the player names to the lobby
  io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
  //getPlayerNamesForVoting(roomCode);
}

function getPlayerNamesForVoting(roomCode) {
  //display all players in the lobby
  console.log("getPlayerNamesForVoting called" + roomCode);
  //io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
}

