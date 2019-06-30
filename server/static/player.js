'use strict'


class player {
    constructor (id, x, y, speed, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
    }

    getID(){
        return this.id;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    addX(x) {
        this.x += x;
    }
    addY(y) {
        this.y += y;
    }
}

module.exports = player;