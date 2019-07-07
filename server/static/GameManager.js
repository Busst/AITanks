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
        for (var p_id in this.players) {
            var player = this.players[p_id];
            var x_speed = 1;
            var y_speed = 2;
            if (this.DetectWallCollision(player, x_speed, y_speed)) {
                player.addX(1);
            }
            
        }



    }

    DetectWallCollision(player, x_speed, y_speed) {
        const x_walls = this.walls.x_walls;
        const y_walls = this.walls.y_walls;
        const x = player.x;
        const y = player.y;
        const width = player.width;
        const height = player.height;
        for (var id in x_walls) {   //vertical
            var wall = x_walls[id];
            var right = x + width;
            var bot = y + height;
            if (right >= wall.x && right <= wall.x2 ){
                
                return false;
            }
            
        }

        return true;
    }





}

module.exports = GameManager;