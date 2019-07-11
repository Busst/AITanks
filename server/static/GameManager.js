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
        this.walls = map_obj.walls;
        
        console.log("player 1 spawn: {" + this.spawn.p1.x + ", " + this.spawn.p1.y + "}");
        console.log("player 2 spawn: {" + this.spawn.p2.x + ", " + this.spawn.p2.y + "}");
        console.log("player 3 spawn: {" + this.spawn.p3.x + ", " + this.spawn.p3.y + "}");

        for (var i = 1; i <= player_num -2; i++) {
            this.players[''+i] = new this.player_gen(''+i, this.spawn['p'+i].x*100 + 20, this.spawn['p'+i].y*100+50, 7, 'red', 30, 20);
        }
        return true;
    }

    UpdateGame() {
        for (var id in this.players) {
            var player = this.players[id];
            
            var movement = player.getMove();
            var canmove = this.DetectCollisions(player);
            console.log(canmove);
            this.moveUp(player, movement, canmove);
            this.moveLeft(player, movement, canmove);

            
            
            
            
        }
        

    }
    moveLeft(player, movement, canmove) {
        
    }


    moveUp(player, movement, canmove) {
        
    }

    DetectCollisions(player) {
        var move = {
            up: true,
            down: true,
            left: true,
            right: true
        };
        var margin = 2;

        var x_walls = this.walls.x_walls;
        var y_walls = this.walls.y_walls;
        var x = player.x;
        var y = player.y;
        var a = player.a;

        var xx = {
            top_left: x - Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            top_right: x + Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            bot_left: x - Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            bot_right: x + Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.height / 2 + margin)
        };
        var yy = {
            top_right: y - Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.width / 2 + margin),
            top_left: y - Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.width / 2 + margin),
            bot_right: y + Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.width / 2 + margin),
            bot_left: y + Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.width / 2 + margin)
        };
        var x_min;
        var y_min;
        var x_max;
        var y_max;

        
        for (var id in xx) {
            var point = xx[id];
            if (x_min === undefined) {
                x_min = point;
            }
            if (x_max === undefined) {
                x_max = point;
            }
            if (point > x_max) {
                x_max = point;
            }
            if (point < x_min) {
                x_min = point;
            }
        }
        for (var id in yy) {
            var point = yy[id];
            if (y_min === undefined) {
                y_min = point;
            }
            if (y_max === undefined) {
                y_max = point;
            }
            if (point > y_max) {
                y_max = point;
            }
            if (point < y_min) {
                y_min = point;
            }
        }

        for (var id in x_walls) {
            var wall = x_walls[id];
            if (x_min < wall.x2 && x_max > wall.x && y_min < wall.y2 && y_max > wall.y) {
                if (x_min < wall.x) {
                    
                    move.right = false;
                } else {
                    move.left = false;
                }
            }
            
        }
        for (var id in y_walls) {
            var wall = y_walls[id];
            if (x_min < wall.x2 && x_max > wall.x && y_min < wall.y2 && y_max > wall.y) {
                if (y_min < wall.y) {
                    move.down = false;
                } else {
                    move.up = false;
                }
                
            }
            
        }
        
        return move;

    }
    



}

module.exports = GameManager;