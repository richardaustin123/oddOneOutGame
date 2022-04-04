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
  socket.on('new-game', function() {
    console.log("user id: " + socket.id);
    //make a random 6 digit room code 
    var roomCode = Math.floor(Math.random() * 1000000);
    console.log("room code: " + roomCode);
    socket.join(roomCode);
    socket.emit('room-code', roomCode);
  });

  //join lobby 
  socket.on('join-game', function(code) {
    //console log the room code
    console.log(code);
    //join the room
    socket.join(code);
    socket.emit('room-code', code);
  })

  socket.on('start-game', function(){
    console.log("starting game");
    io.emit('game-started');
  })

});

