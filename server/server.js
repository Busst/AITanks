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


    var gen = new map_gen(8, 8);
    var move_player = new move_piece(100);
    var map_obj = gen.generate_map();
    var map = map_obj.map;
    var spawn = map_obj.spawn;

    console.log("player 1 spawn: {" + spawn.p1.x + ", " + spawn.p1.y+ "}");
    console.log("player 2 spawn: {" + spawn.p2.x + ", " + spawn.p2.y + "}");
    console.log("player 3 spawn: {" + spawn.p3.x + ", " + spawn.p3.y + "}");
    
    
    var players = {};
    players['1'] = new p('1', spawn.p1.x*100 + 50, spawn.p1.y*100 + 50, 5, 'red');
    players['2'] = new p('2', spawn.p2.x*100 + 50, spawn.p2.y*100 + 50, 5, '#F801CF');
    players['3'] = new p('3', spawn.p3.x*100 + 50, spawn.p3.y*100 + 50, 5, 'yellow');
    
    
    //console.log(map);
    setInterval(function() {
        move_player.update_players(players, map);
        
        var data = {players: players, map: map };
        
        io.emit('update', data);
    }, 1000 / 60);
    
