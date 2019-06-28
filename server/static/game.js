
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 800;
    var SQUARE_HEIGHT = CANVAS_HEIGHT / 8; //???
    var SQUARE_WIDTH = CANVAS_WIDTH / 8;

    var socket = io();

  
    var canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext('2d');
    socket.on('update', function(data) {
        var players = data.players;

        var map = data.map;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.fillStyle = 'green';
        for (var id in players) {
            var player = players[id];
            context.beginPath();
            context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
            context.fill();
            
            
        }
        context.fillStyle = 'black'
        context.lineWidth = 2;
        var draw_factor = 100;
        var draw_width = 2;
        
        for (var id in map){
            var wall = map[id];
            if (wall === undefined) continue;
            var line_pos = wall.tile;
            context.beginPath();
            /*
                1 = left wall
                2 = top wall
                4 = right wall
                8 = bot wall
            */
            if (line_pos % 2 > 0){
                context.rect(wall.x * SQUARE_WIDTH, wall.y * SQUARE_HEIGHT, draw_width, draw_factor);
            }
            if ((line_pos >> 1) % 2 > 0) {
                context.rect(wall.x * SQUARE_WIDTH, wall.y * SQUARE_HEIGHT, draw_factor, draw_width);
            } 
            if ((line_pos >> 2) % 2 > 0) {
                context.rect(wall.x * SQUARE_WIDTH+draw_factor, wall.y * SQUARE_HEIGHT, draw_width, draw_factor);
            } 
            if ((line_pos >> 3) % 2 > 0) {
                context.rect(wall.x * SQUARE_WIDTH, wall.y * SQUARE_HEIGHT+draw_factor, draw_factor, draw_width);
            } 
            context.stroke();
        }
        
    });
    