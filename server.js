var express = require('express'),
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
var rooms = {};


io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('chat message', function (msg) {
    console.log('message from ' + socket.id + ': ' + msg.message);
    io.emit('message', msg);
  });


  //join  room
  socket.on('new-game', function(name) {
    console.log("user id: " + socket.id);
    //make a random 6 digit room code 
    var roomCode = Math.floor(Math.random() * 1000000);
    console.log("room code: " + roomCode);
    socket.join(roomCode);

    //create a new room
    rooms[roomCode] = {
      roomCode: roomCode,
      players: [],
      gameStarted: false,
      gameOver: false,
    }

    //add the player to the room
    rooms[roomCode].players.push({
      id: socket.id,
      name: name,
      score: 0,
      ready: false,
    });

    console.log("player added to room: " + roomCode);
    console.log(rooms);
    console.log(rooms[roomCode].players);

    socket.emit('room-code', roomCode);
    sendPlayerNamesForLobby(roomCode);
  });

  //join lobby 
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

    console.log("player added to room: " + data.code);
    console.log(rooms[data.code].players);

    socket.emit('room-code', data.code);
    sendPlayerNamesForLobby(data.code);
  })

  socket.on('start-game', function(){
    console.log("starting game");
    io.emit('game-started');
  })

});

function sendPlayerNamesForLobby(roomCode) {
  //send the player names to the lobby
  io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
}

