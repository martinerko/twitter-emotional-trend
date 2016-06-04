var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
app.use('/public', express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  setInterval(function() {
    socket.emit('news', Math.random());
  }, 1000);
});
