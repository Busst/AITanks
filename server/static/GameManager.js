'use strict'

class GameManager {

    constructor () {
        
        this.players = {};
        this.map;
        this.walls;
        this.map_gen = require('./MapGen');
        this.player_gen = require('./player');

    }

    /**
     * generates map, players, spawns
     * 
     */
    init(player_num, grid_size) {
        var gen = new this.map_gen(grid_size, grid_size, 4, 100);
        var map_obj = gen.generate_map();
        this.spawn = map_obj.spawn;
        //this.map = map_obj.map;
        this.walls = map_obj.walls;
        
        console.log("player 1 spawn: {" + this.spawn.p1.x + ", " + this.spawn.p1.y + "}");
        console.log("player 2 spawn: {" + this.spawn.p2.x + ", " + this.spawn.p2.y + "}");
        console.log("player 3 spawn: {" + this.spawn.p3.x + ", " + this.spawn.p3.y + "}");

        for (var i = 1; i <= player_num; i++) {
            this.players[''+i] = new this.player_gen(''+i, this.spawn['p'+i].x*100 + 50 - 10, this.spawn['p'+i].y*100 + 50 - 10, 7, 'red', 20, 20);
        }
        return true;
    }

    UpdateGame() {




    }

    



}

module.exports = GameManager;