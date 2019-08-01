'use strict'

var bb = require('../bullet');

class minigun extends bb{
    constructor (type, id, x, y, a, speed, radius, life) {
        super (type, id, x, y, a, speed, radius, 3.5);
        this.max_bullets = 15;
    }
    update() {
        
        for (var id in this.bullet_array) {
            this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
        }
       
    }


}

module.exports = minigun;