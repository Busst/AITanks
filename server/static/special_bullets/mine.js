'use strict'

var bb = require('../bullet');

class mine extends bb{

    constructor  (type, id, x, y, a, speed, radius, life) {
        super(type, id, x, y, a, 1.5, 1, 10000);
        this.color = 'white';
        this.testable = false;
        this.exploded = false;
    }

    makePlayerTestable() {
        
        if (this.max_life - 50 === this.life) {
            this.player_testable = true;
        }
    }

    decayLife() {
        for (var id in this.bullet_array){
            if (!this.exploded && this.bullet_array[id].radius < 30){
                this.bullet_array[id].radius += .8;   
            }
        }
        this.makePlayerTestable();
        if (this.player_testable) {
            this.testable = true;
            this.color = '#f0e1e1';
        }
        if (--this.life === 0) {
            return true;
        }
        
        return false;
    }

    update() {
        if (!this.player_testable || this.exploded) {
            for (var id in this.bullet_array) {
                this.bullet_array[id].x -= Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
                this.bullet_array[id].y -= Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            }
        }
    }

    explode() {
        this.type = 'default';
        this.exploded = true;
        this.life = 50;
        var bullet;
        for (var id in this.bullet_array) {
            bullet = this.bullet_array[id];
        }
        if (bullet === undefined) {
            return;
        }
        var angle = 15
        for (var i = 0; i < angle; i++) {
            this.bullet_array[i] = {
                x: bullet.x,
                y: bullet.y,
                a: bullet.a + (360 / angle) * i,
                radius: bullet.radius / 7
            };
        }
    }







}

module.exports = mine;