'use strict'

class GameManager {

    constructor () {
        
        this.players = {};
        this.bullets = [];
        this.map;
        this.walls;
        this.map_gen = require('./MapGen');
        this.player_gen = require('./player');
        this.bullet_gen = require('./bullet');
        this.q = 0;

    }

    /**
     * generates map, players, spawns
     * 
     */
    init(player_num, grid_size) {
        this.grid_size = grid_size;
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
                left: false,
                fire: false
            };
        }
        
        this.playerCollisions(input);

        this.bulletCollisions();
        this.playerBulletCollisions();
        
        
        

    }

    playerBulletCollisions() {
        for (var p_id in this.players) {
            var player = this.players[p_id];
            var player_vert = this.getPlayerVertices(player); //change to player
            var player_axes = this.getAxes(player_vert);
            for (var b_id in this.bullets) {
                var bullet = this.bullets[b_id];
                var bullet_v = this.getBulletVertices(bullet); //change to bullet class
                var bullet_axes = this.getAxes(bullet_v);

                var hit = this.test(player_axes, bullet_axes, player_vert, bullet_v) && bullet.testable;
                if (hit) {
                    console.log("player " + p_id + ": has been slain");
                }

            }
        }

    }

    playerCollisions(input) {
        for (var id in this.players) {
            var player = this.players[id];
            
            var movement = player.getMove(input);
            var firing = player.fire(input.fire);
            var angle = player.a;
            player.update(movement.forward, movement.back, movement.left, movement.right);
            var player_vert = this.getPlayerVertices(player);
            var collision = this.DetectWallCollisions(player_vert);

            var wall1 = collision.wall1;
            var wall2 = collision.wall2;

            if (collision.overlap) {
                var sin = Math.abs(Math.sin(player.a * Math.PI / 180)) * (player.height/ 2);
                var cos = Math.abs(Math.cos(player.a * Math.PI / 180)) * (player.width / 2);
                var top = player.y - cos - sin;
                var bot = player.y + cos + sin;
                var left = player.x- cos - sin;
                var right= player.x+ cos + sin;
                var move = 2;
                if (wall1 !== undefined) {
                    if (left > wall1.x2 && (top < wall1.y2 && bot > wall1.y)) {
                        player.x += move;
                    } else if (right < wall1.x && (top < wall1.y2 && bot > wall1.y)) {
                        player.x -= move;
                    } else if (player.y > wall1.y && player.y > wall1.y2 ) {
                        player.y += move;
                    } else if (player.y < wall1.y && player.y < wall1.y2) {
                        player.y -= move;
                    }
                }
                if (wall2 !== undefined) {
                    
                    if (bot < wall2.y2 && (left < wall2.x2 && right > wall2.x)) {
                        player.y -= move;
                    } else if (top > wall2.y && (left < wall2.x2 && right > wall2.x)) {
                        player.y += move;
                    } else if (right > wall2.x2 && bot > wall2.y2 && top < wall2.y) {
                        player.x += move;
                    } else if (left < wall2.x && bot > wall2.y2 && top < wall2.y) {
                        player.x -= move;
                    }
                }
            }
            
            if (firing !== undefined) {
                console.log('shooting ' + firing);
                this.bullets[this.bullets.length] = new this.bullet_gen('default', id,
                    player.x + Math.cos(angle * Math.PI / 180) * 10, 
                    player.y + Math.sin(angle * Math.PI / 180) * 10, 
                    angle, 3, 4,
                    2);
                    
            }

            
            //1 = up down
            //2 = left right
            
        }
    }
    
    bulletCollisions() {
        for (var id in this.bullets) {
            var bullet = this.bullets[id];
            
            if (bullet.lifeDecay()) {
                this.bullets.splice(id, 1);
                this.players[bullet.id].addDefaultBullet();
            }
            bullet.update();
            var bullet_v = this.getBulletVertices(bullet);
            var collision = this.DetectWallCollisions(bullet_v, "bullet");
            var wall1 = collision.wall1;
            var wall2 = collision.wall2;
            
            if (collision.overlap) {
                var sin = Math.abs(Math.sin(bullet.a * Math.PI / 180)) * (bullet.radius / 2);
                var cos = Math.abs(Math.cos(bullet.a * Math.PI / 180)) * (bullet.radius / 2);
                var top = bullet.y - cos - sin;
                var bot = bullet.y + cos + sin;
                var left = bullet.x- cos - sin;
                var right= bullet.x+ cos + sin;
                
                if (wall1 !== undefined) {
                    if ((left > wall1.x2 && (top < wall1.y2 && bot > wall1.y)) || (right < wall1.x && (top < wall1.y2 && bot > wall1.y))) {
                        bullet.a = (540 - bullet.a) % 360;
                    } else if ((bullet.y > wall1.y && bullet.y > wall1.y2) || (bullet.y < wall1.y && bullet.y < wall1.y2)) {
                        bullet.a = (360 - bullet.a) % 360;
                    }
                }
                if (wall2 !== undefined) {
                    
                    if ((bot < wall2.y2 && (left < wall2.x2 && right > wall2.x)) || (top > wall2.y && (left < wall2.x2 && right > wall2.x))) {
                        bullet.a = (360 - bullet.a) % 360;
                    } else if ((right > wall2.x2 && bot > wall2.y2 && top < wall2.y) || (left < wall2.x && bot > wall2.y2 && top < wall2.y)) {
                        bullet.a = (540 - bullet.a) % 360;
                    } 
                    
                }
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

    getPlayerVertices(player) {
        var margin = 1;
        var x = player.x;
        var y = player.y;
        var a = player.a;
        var vertices1 = [];

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
        
        vertices1[0] = top_left;
        vertices1[1] = top_right;
        vertices1[2] = bot_right;
        vertices1[3] = bot_left;
        return vertices1;

    }

    getBulletVertices(bullet) {
        var vertices1 = [];
        var top = {
            x: bullet.x - bullet.radius,
            y: bullet.y - bullet.radius
        }
        var bot = {
            x: bullet.x + bullet.radius,
            y: bullet.y - bullet.radius
        }
        var right = {
            x: bullet.x + bullet.radius,
            y: bullet.y + bullet.radius
        }
        var left = {
            x: bullet.x - bullet.radius,
            y: bullet.y + bullet.radius
        }
        
        vertices1[0] = top;
        vertices1[1] = bot;
        vertices1[2] = right;
        vertices1[3] = left;
        return vertices1;
    }

    testWalls(walls, axes1 ,vertices1) {
        var overlap = false;
        var vertices2 = [];
        var walls_skimmed = [];

        var x = Math.trunc(vertices1[0].x / 100);
        var y = Math.trunc(vertices1[0].y / 100);
        
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (x+i >= 0 && x+i <= this.grid_size && y+j >= 0 && y+j <= this.grid_size ) {
                    walls_skimmed.push(""+(x+i) + (y + j));        
                }
            }
        }
        var wall_hit;
        for (var id in walls_skimmed) {
            var wall = walls[walls_skimmed[id]];
            if (wall === undefined) {continue;}
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
            var axes2 = this.getAxes(vertices2);
            if (!overlap) {
                overlap = this.test(axes1, axes2, vertices1, vertices2);
                 
                if (overlap) {
                    wall_hit = wall;
                    break;   
                }
                
            }
            
        }
        return {overlap, wall_hit};

    }

    DetectWallCollisions(vertices1, type) {
        
        var x_walls = this.walls.x_walls;
        var y_walls = this.walls.y_walls;

        var axes1 = this.getAxes(vertices1);
        
        var overlap1 = false;
        var overlap2 = false;

        overlap1 = this.testWalls(x_walls, axes1, vertices1);
        overlap2 = this.testWalls(y_walls, axes1, vertices1);
        

        var overlap = overlap1.overlap || overlap2.overlap;
        var wall1 = overlap1.wall_hit;
        var wall2 = overlap2.wall_hit;
        
        return {overlap, wall1, wall2};

    }
    



}

module.exports = GameManager;