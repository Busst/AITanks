'use strict'

var bb = require('../bullet');

class bubble extends bb {

    constructor (type, id, x, y, a, speed, radius, life) {
        super (type, id, x, y, a, speed, radius, life + 4);
        this.past_moves = [];
        
        
        this.seed = 0;
        this.random = Math.cos(this.seed);
        for (var i = -2; i <= 2; i++) {
            if (i !== 0)
                this.bullet_array.push({x, y, a: a + i * 20, radius});
        }
    }

    
    effects() {
        if (this.max_life - 25 >= this.life) {
            return true;
        }
        return false;
    }
    doBubbleShit(bullet) {
        
        var angle = Math.random() * 360 + 360;
        
        bullet.a += (angle % 20 - 10) + 360;
        bullet.a = bullet.a % 360;
        
    }
    update() {
        this.seed++;
        for (var id in this.bullet_array) {
            if (this.effects()){
                this.doBubbleShit(this.bullet_array[id]);
                this.speed = Math.random() * 2;
                if ( this.bullet_array[id].radius < 10) {
                    this.bullet_array[id].radius++;
                }
                
            }
            this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;

        }

    }

}

module.exports = bubble;