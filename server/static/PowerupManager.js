'use strict'

class PowerupManager {

    constructor (map, start) {
        
        this.timer = 0;

        this.powers = [
            "bubbles",
            "shotgun",
            "rocket"
            ];

            
        var wallx = map.up_down;
        var wally = map.left_right; 
        
        var open = [{x: start.x, y: start.y}];
        var closed = [];
        var spawns = [];
        var cur;
        this.getSpawnArray(open, closed, wallx, wally, cur, spawns);
        this.spawns = spawns;

    }
    getPowerSpawn() {
        var id = Math.trunc(Math.random() * this.spawns.length);
        var spawn = this.spawns[id];
        this.spawns.splice(id, 1);
        return spawn;
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




    /**
     * 
     * @param {*} open 
     * @param {*} closed 
     * @param {*} mapx 
     * @param {*} mapy 
     * @param {*} spawns 
     * 
     * issues: doesn't distinguish between wallx and wally when 
     * adding to open
     */
    
    getSpawnArray(open, closed, mapx, mapy, cur, spawns) {
        var cur = open.pop();
        var x = cur.x;
        var y = cur.y;
        closed.push(cur);
        spawns.push(cur);

        
        if (mapx[''+x+y] === undefined && !this.in({x: x-1, y: y}, open) && !this.in({x: x-1, y: y}, closed)) {
            open.push({x: x-1, y: y});
        }
        if (mapy[''+x+y] === undefined && !this.in({x: x, y: y-1}, open) && !this.in({x: x, y: y-1}, closed)) {
            open.push({x: x, y: y-1});
        }
        if (mapx[''+(x+1)+y] === undefined && !this.in({x: x+1, y: y}, open) && !this.in({x: x+1, y: y}, closed)) {
            open.push({x: x+1, y: y});
        }
        if (mapy[''+x+(y+1)] === undefined && !this.in({x: x, y: y+1}, open) && !this.in({x: x, y: y+1}, closed)) {
            open.push({x: x, y: y+1});
        }

        if (open.length === 0) {
            console.log("Power spawns done");
            return;
        }
        this.getSpawnArray(open, closed, mapx, mapy, cur, spawns);
    }
    
    in(node, a) {
        for (var id in a) {
            var coor = a[id];
            if (coor.x === node.x && coor.y === node.y) {
                return true;
            }
        }
        return false;
    }


}

module.exports = PowerupManager;