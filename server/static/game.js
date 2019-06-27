
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;

    var socket = io();

  
    var canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext('2d');
    socket.on('update', function(players, walls) {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.fillStyle = 'green';
        for (var id in players) {
            var player = players[id];
            context.beginPath();
            context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
            context.fill();
            
        }
        context.fillStyle = 'black'
        for (i in walls) {
            var wall = walls[i];
            context.lineWidth = 10;
            context.strokeRect(wall.x+3, 0, 1, 50)
        }
    });;