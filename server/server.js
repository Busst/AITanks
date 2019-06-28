    // Dependencies
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var socketIO = require('socket.io');
    var app = express();
    var server = http.Server(app);
    var io = socketIO(server);
    const map_gen = require('./static/MapGen');
    const p = require('./static/player');
    const move_piece = require('./static/Move');
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

    // Add the WebSocket handlers
    io.on('connection', function(socket) {
    });


    var gen = new map_gen(1, 8, 8);
    var move_player = new move_piece(7);
    var map = gen.generate_map();

    var players = {};
    players['1'] = new p('1', 100, 100, 21);
    players['2'] = new p('2', 200, 200, 5);
    players['3'] = new p('3', 300, 300, 15);
    
    
    //console.log(map);
    setInterval(function() {
        move_player.update_players(players);
        var data = {players: players, map: map };
        io.emit('update', data);
    }, 1000 / 60);

