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

        for (var i = 1; i <= player_num - 2; i++) {
            this.players[''+i] = new this.player_gen(''+i, this.spawn['p'+i].x*100 + 20, this.spawn['p'+i].y*100+50, 7, 'red', 30, 20);
        }

        var test1 = [];
        var test2 = [];
        test1[0] = {x: 0, y: 0};
        test1[1] = {x: 0, y: 10};
        test1[2] = {x: 10, y: 0};
        test1[3] = {x: 10, y: 10};
        test2[0] = {x: 5, y: 5};
        test2[1] = {x: 5, y: 15};
        test2[2] = {x: 15, y: 5};
        test2[3] = {x: 15, y: 15};
        var axes1 = this.getAxes(test1);
        console.log(axes1);
        var axes2 = this.getAxes(test2);
        console.log(axes2);
        var overlap = true;
        for (var j = 0; j < axes1.length; j++) {
            var axis = axes1[j];
            var p1 = this.project(axis, test1);
            var p2 = this.project(axis, test2);
            console.log(p1.max + " " + p1.min);
            console.log(p2.max + " " + p2.min);
            console.log();
            if (p1.max > p2.min && p1.max < p2.max || p1.min > p2.min && p1.min < p2.max) {
                overlap = false;
            }
        }console.log();console.log();
        for (var j = 0; j < axes2.length; j++) {
            var axis = axes2[j];
            var p1 = this.project(axis, test1);
            var p2 = this.project(axis, test2);
            console.log(p1.max + " " + p1.min);
            console.log(p2.max + " " + p2.min);
            console.log();
            if (p1.max > p2.min && p1.max < p2.max || p1.min > p2.min && p1.min < p2.max) {
                overlap = false;
            }
        }
        console.log(overlap);
        return false;
    }

    UpdateGame(input) {
        if (input === undefined) {
            input = {
                forward: false,
                back: false,
                right: false,
                left: false
            };
        }
        
        for (var id in this.players) {
            var player = this.players[id];
            
            var movement = player.getMove(input);
            var angle = player.a;
            player.moveForward(movement.forward, 0);
            player.moveBack(movement.back, 0);
            player.rotate(movement.right - movement.left);
            
            //1 = up down
            //2 = left right
            var canmove = this.DetectCollisions(player);
            if (!canmove.up && angle > 180) {
                player.moveBack(movement.forward, 1);
                player.y += .25;
            }
            if (!canmove.up && angle < 180) {
                player.moveForward(movement.back, 1);
                player.y += .25;
            }
            if (!canmove.down && angle > 180) {
                player.moveForward(movement.back, 1);
                player.y -= .25;
            }
            if (!canmove.down && angle < 180) {
                player.moveBack(movement.forward, 1);
                player.y -= .25;
            }
            
            if (!canmove.right && (angle > 270 || angle < 90)) {
                player.moveBack(movement.forward, 2);
                player.x -= .25;
            }
            if (!canmove.right && angle < 270 && angle > 90) {
                player.moveForward(movement.back, 2);
                player.x -= .25;
            }
            if (!canmove.left && (angle < 90 || angle > 270)) {
                player.moveForward(movement.back, 2);
                player.x += .25;
            }
            if (!canmove.left && angle > 90 && angle < 270) {
                player.moveBack(movement.forward, 2);
                player.x += .25;
            }
            
            
            
        }
        

    }
    
    getAxes(vertices) {
        var axes = [];
        for (var i = 0; i < vertices.length; i++){
            var p1 = vertices[i];
            var p2 = vertices[i + 1 === vertices.length ? 0 : i + 1];
            var edge = {
                x: p1.x - p2.x,
                y: p1.y - p2.y
            };
            if (edge.x === 0) {
                edge.y = -edge.y
            } else {
                edge.x = -edge.x;
            }
            var sqrt = Math.sqrt(Math.pow(edge.x, 2) + Math.pow(edge.y, 2));
            edge.x = edge.x / sqrt;
            edge.y = edge.y / sqrt;
            axes[i] = edge;
        }
        return axes;
    }

    project(axis, vertices) {
        var min = this.dot(axis, vertices[0]);
        var max = min;
        for (var i = 1; i < vertices.length; i++) {
            var p = this.dot(axis, vertices[i]);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        return {min, max};
    }

    dot(p1, p2) {
        var dot = p1.x * p2.x + p1.y * p2.y;
        return dot;
    }




    DetectCollisions(player) {
        var move = {
            up: true,
            down: true,
            left: true,
            right: true
        };
        var margin = 1;

        var x_walls = this.walls.x_walls;
        var y_walls = this.walls.y_walls;
        var x = player.x;
        var y = player.y;
        var a = player.a;

        //adding fixes to sat

        var top_left = {
            x: x - Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            y: y - Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.width / 2 + margin)
        };
        var top_right = {
            x: x + Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            y: y - Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.width / 2 + margin),
        };
        var bot_left = {
            x: x - Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            y: y + Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.width / 2 + margin)
        };
        var bot_right = {
            x: x + Math.cos(a * Math.PI / 180) * (player.width / 2 + margin) - Math.sin(a * Math.PI / 180) * (player.height / 2 + margin),
            y: y + Math.cos(a * Math.PI / 180) * (player.height / 2 + margin) + Math.sin(a * Math.PI / 180) * (player.width / 2 + margin)
        };

        var vertices1 = [];
        var vertices2 = [];
        vertices1[0] = top_left;
        vertices1[1] = top_right;
        vertices1[2] = bot_left;
        vertices1[3] = bot_right;
        var axes1 = this.getAxes(vertices1);
        
        var axes2;

        for (var id in x_walls) {
            var wall = x_walls[id];
            vertices2[0] = {
                x: wall.x,
                y: wall.y
            };
            vertices2[1] = {
                x: wall.x2,
                y: wall.y
            };
            vertices2[2] = {
                x: wall.x,
                y: wall.y2
            };
            vertices2[3] = {
                x: wall.x2,
                y: wall.y2
            };
            axes2 = this.getAxes(vertices2);
            var overlap = true;
            /*
            for (var j = 0; j < axes1.length; j++) {
                var axis = axes1[j];
                var p1 = this.project(axis, vertices1);
                var p2 = this.project(axis, vertices2);
                if (p1.max > p2.min && p1.max < p2.max || p1.min > p2.min && p1.min < p2.max) {
                    overlap = false;
                }
            }
            for (var j = 0; j < axes2.length; j++) {
                var axis = axes2[j];
                var p1 = this.project(axis, vertices1);
                var p2 = this.project(axis, vertices2);
                if (p1.max > p2.min && p1.max < p2.max || p1.min > p2.min && p1.min < p2.max) {
                    overlap = false;
                }
            }
            if (overlap) {
                console.log("overlapping " + id);
            }
            */



            
            
        }



        //end of fixes


        /*
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
                    if (x_min < wall.x) {
                        move.right = false;
                    } else {
                        move.left = false;
                    }
                }
                
            }



            
        }
        for (var id in y_walls) {
            var wall = y_walls[id];
            if (x_min < wall.x2 && x_max > wall.x && y_min < wall.y2 && y_max > wall.y) {
                
                if (x_max < wall.x) {
                    move.right = false;
                } else if (x_min > wall.x2){
                    move.left = false;
                } else {
                    if (y_min < wall.y) {
                        move.down = false;
                    } else {
                        move.up = false;
                    }
                }
                
            }
            
        }
        */
        return move;

    }
    



}

module.exports = GameManager;