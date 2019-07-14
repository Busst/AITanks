
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 800;
    var SQUARE_HEIGHT = CANVAS_HEIGHT / 8; //???
    var SQUARE_WIDTH = CANVAS_WIDTH / 8;

    var socket = io();

  
    var canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext('2d');
    var a = 0;
    socket.on('update', function(data) {
        var players = data.players;

        var map = data.map;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        //context.rotate(0);
        context.beginPath();
        context.fillStyle = 'black'
        context.lineWidth = 1;
        var draw_factor = 100;
        var draw_width = 6;
        
        for (var id in map.y_walls) {
            var wall = map.y_walls[id];
            context.rect(wall.x, wall.y, wall.x2 - wall.x, wall.y2 - wall.y);
            context.fill();
        }
        
        
        for (var id in map.x_walls){
            var wall = map.x_walls[id];
            
            context.rect(wall.x, wall.y, wall.x2 - wall.x, wall.y2 - wall.y);

        }
        context.stroke();

        for (var id in players) {
            var player = players[id];
            context.save();
            context.fillStyle = player.color;
            context.beginPath();
            context.translate(player.x, player.y);
            context.rotate(player.a * Math.PI / 180);
            context.rect(-player.width / 2, - player.height / 2, player.width, player.height);
            context.fill();
            context.stroke();
            context.restore();
            
            
            
        }
        
    });
    