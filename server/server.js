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
    
    //ai server
    var net = require('net');
    var AI_PORT = 5002;
    var HOST = '127.0.0.1';

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');

    server.on('listening', function() {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ':' + address.port);
    });

    server.on('message', function(message, remote) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        server.send(Buffer.from("Hello from the server"), 6000, 'localhost');
    });
    

    server.bind(AI_PORT, HOST);
    
    setInterval(function() {
        var pack = manager.pack;
        var packagedData = "";
        if (pack !== undefined) {
            for (var id in pack){
                var player_pack = pack[id];
                packagedData += pack[id].me;
                packagedData += "::" + pack[id].bullets;
                packagedData += "::" + pack[id].pickups;
                packagedData += "::" + pack[id].players;
                packagedData += "::" + pack[id].walls;
                packagedData += "\n";
                break;
            }
        }
        //console.log(packagedData);

        server.send(Buffer.from(packagedData), 6000, 'localhost');
    }, 1000 / 60);









