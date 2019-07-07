
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
        
        for (var id in players) {
            var player = players[id];
            context.fillStyle = player.color;
            context.beginPath();
            context.rect(player.x, player.y, player.width, player.height);
            //context.arc(player.x, player.y, 5, 0, 2 * Math.PI);
            //context.fill();
            context.fill();
            context.stroke();
            //context.fillStyle = 'green';
            //context.beginPath();

            
            
        }
        context.fillStyle = 'black'
        context.lineWidth = 2;
        var draw_factor = map.height;
        var draw_width = map.width;

        for (var id in map.y_walls) {
            var wall = map.y_walls[id];
            context.beginPath();
            context.rect(wall.x, wall.y, draw_factor, draw_width);
            context.fill();
            context.stroke();
        }
        
        for (var id in map.x_walls){
            var wall = map.x_walls[id];
            context.beginPath();
            context.rect(wall.x, wall.y, draw_width, draw_factor);
            context.stroke();



            /*
            var wall = map[id];
            if (wall === undefined) continue;
            var line_pos = wall.tile;
            context.beginPath();
            
                1 = left wall
                2 = top wall
                4 = right wall
                8 = bot wall
            
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
            if ((line_pos >> 4) % 2 > 0) {
                context.fillStyle = 'green';
                context.beginPath();
                context.arc(wall.x * SQUARE_WIDTH + SQUARE_WIDTH / 2, wall.y * SQUARE_HEIGHT + SQUARE_HEIGHT / 2, 5, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            }
            */
        }
        
    });
    