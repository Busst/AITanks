    // Dependencies
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var socketIO = require('socket.io');
    var dgram = require('dgram');
    var app = express();
    var server = http.Server(app);
    
    var io = socketIO(server);
    var client_server = dgram.createSocket('udp4');
    
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
    client_server.on('listening', function() {
        var address = client_server.address();
        console.log('AI Server listening on ' + address.address + ':'+ address.port);
    });

    client_server.on('message', function(data, remote) {
        console.log(remote.address + ':' + remote.port +' says ' + data)
    });

    client_server.bind(port, host);
    setInterval(function() {

    }, 1000 / 60);










