    // Dependencies
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var socketIO = require('socket.io');
    var app = express();
    var server = http.Server(app);
    var io = socketIO(server);

    var net = require('net');
    
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
    manager.init(3);
    var aiInput = {
        left: false,
        right: false,
        forward: false,
        back: false,
        fire: false
    };


    setInterval(function() {
        //console.log(aiInput);
        manager.UpdateGame(input, aiInput);
        var data = {
            grid: manager.grid_size,
            players: manager.players,
            map: manager.walls,
            bullets: manager.bullets,
            powers: manager.powerUps,
            events: manager.events
        };
        
        io.emit('update', data);
        
    }, 1000 / 80);
    
    //ai stuff
    var host = '127.0.0.1';
    var port = 5001;

    net.createServer(function(socket) {
        
        socket.on('data', function(data) {

            aiInput.forward = data[0] === 49;
            aiInput.back = data[1] === 49;
            aiInput.left = data[2] === 49;
            aiInput.right = data[3] === 49;
            aiInput.fire = data[4] === 49;
            
            
        });
        socket.on('close', function(data) {
            console.log("connection closed");
        });
    }).listen(port, host);
    console.log("listening on port " + port);