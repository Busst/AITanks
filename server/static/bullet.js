'use strict'

class bullet {

    constructor (type, id, x, y, a, speed, radius, life){
        this.type = type;
        this.x = x;
        this.y = y;
        this.a = a;
        this.speed = speed;
        this.radius = radius;
        this.life = life * 100;
        this.id = id
    }

    lifeDecay() {
        if (--this.life === 0) {
            return true;
        }
        return false;
    }

    update() {
        this.x += Math.cos(this.a * Math.PI / 180) * this.speed;
        this.y += Math.sin(this.a * Math.PI / 180) * this.speed;
    }






}


module.exports = bullet;