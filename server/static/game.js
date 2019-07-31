
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
        left: false,
        reset: false,
        addPower: false
        
    };
    function keyDownHandler(event) {
        var keyPressed = String.fromCharCode(event.keyCode);
        
        
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
        if (keyPressed === "Q") {
            e.reset = true;
        }
        if (keyPressed === "P") {
            e.addPower = true;
        }
        
        socket.emit('input', e);
    }
    function keyUpHandler(event) {
        var keyPressed = String.fromCharCode(event.keyCode);
        
        
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
        if (keyPressed === "Q") {
            e.reset = false;
        }
        if (keyPressed === "P") {
            e.addPower = false;
        }
        
        socket.emit('input', e);
    }
    var grid = 8;
    var canvas = document.getElementById('canvas');
    
    var context = canvas.getContext('2d');
    var display = 1;
    socket.on('update', function(data) {
        
        grid = data.grid;
        canvas.width = CANVAS_WIDTH - 100* (8 - grid);
        canvas.height = CANVAS_HEIGHT - 100 * (8 - grid);
        var events = data.events;
        if (events['hit']) {
            var audio = new Audio('./static/assets/explosion.mp3');
            audio.play();
        }
        if (events['bullet']) {
            var audio = new Audio('./static/assets/fire.mp3');
            audio.play();
        }
        if (events['pow_spawn']) {
            var audio = new Audio('./static/assets/power_spawn.mp3');
            audio.play();
        }
        if (events['pickup']) {
            var audio = new Audio('./static/assets/pickup.mp3');
            audio.play();
        }
        var players = data.players;
        var bullets = data.bullets;
        var map = data.map;
        var powers = data.powers;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.beginPath();
        context.fillStyle = 'black'
        context.lineWidth = 2 * display;
        
        
        for (var id in map.y_walls) {
            var wall = map.y_walls[id];
            context.rect(wall.x*display, wall.y*display, (wall.x2 - wall.x)*display, (wall.y2 - wall.y)*display);
            context.fill();
        }
        
        
        for (var id in map.x_walls){
            var wall = map.x_walls[id];
            
            context.rect(wall.x*display, wall.y*display, (wall.x2 - wall.x)*display, (wall.y2 - wall.y)*display);

        }
        context.stroke();

        for (var id in bullets) {
            var bullet = bullets[id].bullet_array;
            if (bullets[id].type === 'bubbles'){
                context.lineWidth = 3;
            }
            
             
            context.fillStyle = bullets[id].color;

            for (var b_id in bullet) {
                var bb = bullet[b_id];
                context.beginPath();
                context.arc(bb.x*display, bb.y*display, bb.radius*display, 0, 2 * Math.PI);
                if (bullets[id].type !== 'bubbles'){
                    context.fill();
                }
                
                context.stroke();
            }
            context.lineWidth = 2 * display;
            
        }

        for (var id in players) {
            var player = players[id];
            context.save();
            context.fillStyle = player.color;
            context.beginPath();
            context.translate(player.x, player.y);
            context.rotate(player.a * Math.PI / 180);
            context.rect(-player.width / 2 * display, - player.height / 2 * display, (player.width- 2)* display, player.height * display);
            context.fill();
            context.stroke();
            context.beginPath();
            context.rect(-2, -player.height / 4 * display, (player.width- 8) * display, (player.height / 2)* display);
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc(0, 0, player.height / 3 * display, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.restore();
            
            
        }

        for (var id in powers) {
            var p = powers[id];
            context.fillStyle = 'purple';
            context.beginPath();
            context.rect((p.x - 5) * display, (p.y - 5) * display, 10 * display, 10 * display);
            context.fill();
            context.stroke();
        }
        
    });
    