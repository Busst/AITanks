
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 800;
    var SQUARE_HEIGHT = CANVAS_HEIGHT / 8; //???
    var SQUARE_WIDTH = CANVAS_WIDTH / 8;

    var socket = io();

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);    

    var e = {
        forward: false,
        back: false,
        right: false,
        left: false
    };
    function keyDownHandler(event) {
        var keyPressed = String.fromCharCode(event.keyCode);
        console.log("moving " + keyPressed);
        
        if (keyPressed === "&") {
            e.forward = true;
        }
        if (keyPressed === "(") {
            e.back = true;
        }
        if (keyPressed === "%") {
            e.left = true;            
        }
        if (keyPressed === "'") {
            e.right = true;
        }
        if (keyPressed === " ") {
            e.fire = true;
        }

        socket.emit('input', e);
    }
    function keyUpHandler(event) {
        var keyPressed = String.fromCharCode(event.keyCode);
        console.log("moving " + keyPressed);
        
        if (keyPressed === "&") {
            e.forward = false;
        }
        if (keyPressed === "(") {
            e.back = false;
        }
        if (keyPressed === "%") {
            e.left = false;            
        }
        if (keyPressed === "'") {
            e.right = false;
        }
        if (keyPressed === " ") {
            e.fire = false;
        }

        socket.emit('input', e);
    }
    var canvas = document.getElementById('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext('2d');
    
    socket.on('update', function(data) {
        var players = data.players;
        var bullets = data.bullets;

        var map = data.map;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.beginPath();
        context.fillStyle = 'black'
        context.lineWidth = 1;
        
        
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

        for (var id in bullets) {
             var bullet = bullets[id];
            // context.fillStyle = 'green';
            // context.beginPath();
            // context.arc(bullet.x-bullet.radius, bullet.y-bullet.radius, bullet.radius, 0, 2 * Math.PI);
            // context.fill();
            // context.stroke();
            // context.beginPath();
            // context.arc(bullet.x-bullet.radius, bullet.y+bullet.radius, bullet.radius, 0, 2 * Math.PI);
            // context.fill();
            // context.stroke();
            // context.beginPath();
            // context.arc(bullet.x+bullet.radius, bullet.y-bullet.radius, bullet.radius, 0, 2 * Math.PI);
            // context.fill();
            // context.stroke();
            // context.beginPath();
            // context.arc(bullet.x+bullet.radius, bullet.y+bullet.radius, bullet.radius, 0, 2 * Math.PI);
            // context.fill();
            // context.stroke();
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
            context.fill();
            context.stroke();

        }

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
    