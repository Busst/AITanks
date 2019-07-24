'use strict'

class bullet {

    constructor (type, id, x, y, a, speed, radius, life){
        this.type = type;
        this.speed = speed;
        this.id = id;
        this.radius = radius;
        this.life = life * 100;
        this.max_life = this.life
        this.collidable = false;
        this.testable = true;
        this.player_testable = false;
        
        this.bullet_array = [{x, y, a, radius}];

        
    }

    decayLife() {

        if (this.max_life - 10 === this.life) {
            this.player_testable = true;
        }
        if (--this.life === 0) {
            return true;
        }
        
        return false;
    }

    update() {
        for (var id in this.bullet_array) {
            this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
        }
    }

    getBulletArray() {
        return this.bullet_array;
    }






}


module.exports = bullet;