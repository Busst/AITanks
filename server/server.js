    // Dependencies
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var socketIO = require('socket.io');
    var app = express();
    var server = http.Server(app);
    var io = socketIO(server);
    const map_gen = require('./static/MapGen');
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


    var gen = new map_gen(1);
    

    var players = {};
    console.log(gen.get_seed());
    
    setInterval(function() {
        
        io.sockets.emit('update', players);
    }, 1000 / 60);

