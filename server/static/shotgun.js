'use strict'

var bb = require('./bullet');

class shotgun extends bb {

    constructor (type, id, x, y, a, speed, radius, life) {
        super (type, id, x, y, a, speed, radius, life);
        
        for (var i = -2; i <= 2; i++) {
            this.bullet_array.push({x, y, a: a + i * 20, radius});
        }
        
    }

    update() {
        for (var id in this.bullet_array) {
            this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
        }
    }

}

module.exports = shotgun;