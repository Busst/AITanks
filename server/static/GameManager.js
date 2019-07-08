'use strict'

class GameManager {

    constructor () {
        
        this.players = {};
        this.map;
        this.walls;
        this.map_gen = require('./MapGen');
        this.player_gen = require('./player');
        this.q = 0;

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
        var player = this.players[''+1];
        var q = this.q;
        if (this.DetectCollisions(player)) {
            
        } 




    }
    DetectCollisions(player) {
        var x_walls = this.walls.x_walls;
        var y_walls = this.walls.y_walls;
        var x = player.x - 2;
        var y = player.y - 2;
        var right = x + player.width + 2;
        var bot = y + player.height + 2;
        for (var id in x_walls) {
            var wall = x_walls[id];
            if (right > wall.x && right < wall.x2 && y < wall.y2 && bot > wall.y) {
                return false;
            }
            if (x > wall.x && x < wall.x2 && y < wall.y2 && bot > wall.y) {
                return false;
            }
        }
        for (var id in y_walls) {
            var wall = y_walls[id];
            if (bot > wall.y && bot < wall.y2 && x < wall.x2 && right > wall.x) {
                return false;
            }
            if (y > wall.y && y < wall.y2 && x < wall.x2 && right > wall.x) {
                return false;
            }
        }

        return true;
        
    }
    



}

module.exports = GameManager;