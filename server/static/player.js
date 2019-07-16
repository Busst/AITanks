'use strict'


class player {
    constructor (id, x, y, speed, color, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.a = 170;
        this.width = width;
        this.height = height; 
        this.time = 0;
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

    moveForward(speed, direction) {
        if (direction != 1){
            this.x += Math.cos(this.a * Math.PI / 180) * speed;
        }
        if (direction != 2) {
            this.y += Math.sin(this.a * Math.PI / 180) * speed;
        }
    }
    moveBack(speed, direction) {
        if (direction != 1){
            this.x += Math.cos(this.a * Math.PI / 180) * speed * -1;
        }
        if (direction != 2) {
            this.y += Math.sin(this.a * Math.PI / 180) * speed * -1;
        }
    }
    rotate(rotation) {
        this.a += rotation;
        this.a = this.a % 360;
        if (this.a < 0)
            this.a = 360 - this.a;
    }

    getMove(input) {
        var move = {};
        move.forward = 0;
        move.back = 0;
        move.right = 0;
        move.left = 0;
        if (input.forward) {
            move.forward = 2;
        }
        if (input.back) {
            move.back = 2;
        }
        if (input.left) {
            move.left = 3;
        }
        if (input.right) {
            move.right = 3;
        }
        
        
        return move;
    }
}

module.exports = player;