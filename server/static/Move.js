'use strict'

class Move {
    
    constructor () {
    }
   
    
    update_players(players) {
        for (var id in players) {
            var player = players[id];
            var rr = this.get_random_move(player.speed);
                player.addX(rr.x );
                player.addY(rr.y);
        }
    }

    get_random_move(speed) {
        return { 
            x: parseInt(Math.random() * speed - speed/2),
            y: parseInt(Math.random() * speed - speed/2)
        };
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }


}

module.exports = Move;