    // Dependencies
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var socketIO = require('socket.io');
    var app = express();
    var server = http.Server(app);
    var io = socketIO(server);
    
    const game_manager = require('./static/GameManager');
    app.set('port', 5000);
    app.use('/static', express.static(__dirname + '/static'));
    // Routing
    app.get('/', function(request, response) {
        response.sendFile(path.join(__dirname, 'index.html'));
    });
    // Starts the server.
    server.listen(5000, function() {
        console.log('Starting server on port 5000');
    });
    var input;
    // Add the WebSocket handlers
    io.on('connection', function(socket) { 
        socket.on('input', function (data) {
            input = data;
        });
    });

    var manager = new game_manager();
    manager.init(3, 8);
    


    setInterval(function() {
        
        manager.UpdateGame(input);
        var data = {players: manager.players, map: manager.walls };
        
        io.emit('update', data);
        
    }, 1000 / 120);
    
