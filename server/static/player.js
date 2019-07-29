'use strict'


class player {
    constructor (id, x, y, speed, color, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.a = 0;
        this.width = width;
        this.height = height; 
        this.time = 0;
        this.curBullet = 'default';
        this.bulletNum = 5;
        this.fireTimer = 0;

        this.alive = true;
        this.lastMove = {};
        
        
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

    fire(input) {
        if (!input || this.curBullet.length === 0) {
            return;
        }
        var temp = this.curBullet;
        if (this.bulletNum > 0) {
            if (this.fireTimer > 0) {
                return;
            }
            this.curBullet = 'default';
            
            this.bulletNum--;

            this.fireTimer = 30;
            
            return temp;
        }
        return;


    }

    undo() {
        this.moveForward(-this.lastMove.forward, 0);
        this.moveBack(-this.lastMove.back, 0);
        this.rotate(this.lastMove.left - this.lastMove.right);
    }

    update(forward, back, left, right) {
        if (this.fireTimer > 0) {this.fireTimer--;}
        this.moveForward(forward, 0);
        this.moveBack(back, 0);
        this.rotate(right - left);
        this.lastMove = {
            forward,
            back,
            left,
            right
        };

    }

    addDefaultBullet(){
        if (this.curBullet.length === 0 ) {
            this.curBullet = 'default';
        }
        this.bulletNum++;
    }

    addPower(power) {
        
        if (this.curBullet === 'default' || this.curBullet.length === 0) {
            console.log("player " + this.id + " picked up " + power);
            this.curBullet = power;
            return true;
        }
        return false;
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
        if (this.a <= 0)
            this.a = 360 - this.a;
    }

    getMove(input) {
        var move = {};
        move.forward = 0;
        move.back = 0;
        move.right = 0;
        move.left = 0;
        if (input.forward) {
            move.forward = 1.5;
        }
        if (input.back) {
            move.back = 1.5;
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