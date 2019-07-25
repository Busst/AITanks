'use strict'

class PowerupManager {

    constructor (map, start) {
        
        this.timer = 0;

        this.powers = [
            "bubbles",
            "shotgun"
            ];

        this.map = map;
        console.log(start);

        


    }

    getPowerup() {
        return this.powers[Math.trunc(Math.random() * this.powers.length)];
    }

    update() {
        this.timer++;
        if (this.timer === 500) {
            this.timer = 0;
            return true;
        }
        return false;
    }

    getSpawnArray() {

    }


}

module.exports = PowerupManager;