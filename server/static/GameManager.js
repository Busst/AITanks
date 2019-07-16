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

            var collision = this.DetectCollisions(player);

            if (collision.down) {
                if (angle > 180) {
                    player.moveBack(movement.forward, 1);
                } else {
                    player.moveForward(movement.back, 1);
                }
                player.y += .15;
            }
            if (collision.up) {
                if (angle < 180) {
                    player.moveBack(movement.forward, 1);
                } else {
                    player.moveForward(movement.back, 1);
                }
                player.y -= .15;
            }
            if (collision.left) {
                if (angle < 90 || angle > 270) {
                    player.moveBack(movement.forward, 2);
                } else {
                    player.moveForward(movement.back, 2);
                }
                player.x -= .15;
            }
            if (collision.right) {
                if (angle > 90 && angle < 270) {
                    player.moveBack(movement.forward, 2);
                } else {
                    player.moveForward(movement.back, 2);
                }
                player.x += .15;
            }

            
            //1 = up down
            //2 = left right
            
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
                var temp = edge.x;
                edge.x = -edge.y;
                edge.y = temp;
            } else {
                var temp = edge.y;
                edge.y = -edge.x;
                edge.x = temp;
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
    test(axes1, axes2, test1, test2) {
        var p1, p2;
        
        for (var j = 0; j < axes1.length; j++) {
            var axis = axes1[j];
            p1 = this.project(axis, test1);
            p2 = this.project(axis, test2);
            
            if (p1.max < p2.min && p1.max < p2.max || p1.min >= p2.max && p1.min > p2.max) {
                return false;   
            }
        }
        
        
        for (var j = 0; j < axes2.length; j++) {
            var axis = axes2[j];
            p1 = this.project(axis, test1);
            p2 = this.project(axis, test2);
            
            if (p1.max < p2.min && p1.max < p2.max || p1.min >= p2.max && p1.min > p2.max) {
                return false;
                
            }
        }
        
        return true;
    }




    DetectCollisions(player) {
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
        vertices1[2] = bot_right;
        vertices1[3] = bot_left;
        var axes1 = this.getAxes(vertices1);
        
        var axes2;
        var overlap1 = false;
        var overlap2 = false;
        var collision = {
            left: false,
            right: false,
            up: false,
            down: false
        };
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
                x: wall.x2,
                y: wall.y2
            };
            vertices2[3] = {
                x: wall.x,
                y: wall.y2
            };
            axes2 = this.getAxes(vertices2);
            if (!overlap1) {
                overlap1 = this.test(axes1, axes2, vertices1, vertices2);
                if (overlap1 && vertices1[0].x > vertices2[0].x && vertices1[2].x > vertices2[0].x) {
                    collision['right'] = true;
                }
                if (overlap1 && vertices1[0].x < vertices2[1].x && vertices1[2].x < vertices2[1].x) {
                    collision['left'] = true;
                }
                if (overlap1 && vertices1[0].y > vertices2[0].y && vertices1[2].y > vertices2[0].y) {
                    collision['down'] = true;
                }
                if (overlap1 && vertices1[0].y < vertices2[2].y && vertices1[2].y < vertices2[2].y) {
                    collision['up'] = true;
                } 
                


            }
            
        }
        for (var id in y_walls) {
            var wall = y_walls[id];
            vertices2[0] = {
                x: wall.x,
                y: wall.y
            };
            vertices2[1] = {
                x: wall.x2,
                y: wall.y
            };
            vertices2[2] = {
                x: wall.x2,
                y: wall.y2
            };
            vertices2[3] = {
                x: wall.x,
                y: wall.y2
            };
            axes2 = this.getAxes(vertices2);
            
            if (!overlap2) {
                overlap2 = this.test(axes1, axes2, vertices1, vertices2);
                if (overlap2 && vertices1[0].y > vertices2[0].y && vertices1[2].y > vertices2[0].y) {
                    collision['down'] = true;
                }
                if (overlap2 && vertices1[0].y < vertices2[2].y && vertices1[2].y < vertices2[2].y) {
                    collision['up'] = true;
                } 
                if (overlap2 && vertices1[0].x > vertices2[0].x && vertices1[2].x > vertices2[0].x) {
                    collision['right'] = true;
                }
                if (overlap2 && vertices1[0].x < vertices2[1].x && vertices1[2].x < vertices2[1].x) {
                    collision['left'] = true;
                }
                
            }
            
        }
        
        return collision;

    }
    



}

module.exports = GameManager;