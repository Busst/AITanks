'use strict'

class GameManager {

    constructor (grid_size) {
        this.grid_size = grid_size;
        this.players = {};
        this.bullets = [];
        this.powerUps = [];
        this.map;
        this.walls;
        this.map_gen = require('./MapGen');
        this.player_gen = require('./player');
        this.bullet_gen = require('./bullet');
        
        var cm = require('./CollisionManager');
        this.collision_manager = new cm(grid_size);
        
        this.players_left = 0;
        this.adding = false;

    }

    /**
     * generates map, players, spawns
     * 
     */
    init(player_num) {
        var gen = new this.map_gen(this.grid_size, this.grid_size, 4, 100);
        var map_obj = gen.generate_map();
        this.spawn = map_obj.spawn;
        this.walls = map_obj.walls;
        this.players_left = player_num;
        
        console.log("player 1 spawn: {" + this.spawn.p1.x + ", " + this.spawn.p1.y + "}");
        console.log("player 2 spawn: {" + this.spawn.p2.x + ", " + this.spawn.p2.y + "}");
        console.log("player 3 spawn: {" + this.spawn.p3.x + ", " + this.spawn.p3.y + "}");

        //for (var i = 1; i <= player_num - 1; i++) {
            //this.players[''+i] = new this.player_gen(''+i, this.spawn['p'+i].x*100 + 20, this.spawn['p'+i].y*100+50, 7, 'red', 30, 20);
        //}
        this.players[''+1] = new this.player_gen(''+1, this.spawn['p'+1].x*100 + 50, this.spawn['p'+1].y*100+50, 7, 'red', 30, 20);
        this.players[''+2] = new this.player_gen(''+2, this.spawn['p'+2].x*100 + 50, this.spawn['p'+2].y*100+50, 7, 'green', 30, 20);
        this.players[''+3] = new this.player_gen(''+3, this.spawn['p'+3].x*100 + 50, this.spawn['p'+3].y*100+50, 7, 'blue', 30, 20);

        var pm = require('./PowerupManager');
        this.power_manager = new pm({up_down: this.walls.x_walls, left_right: this.walls.x_walls}, {x: this.spawn['p'+1].x, y: this.spawn['p'+1].y});

        
    }



    UpdateGame(input) {
        if (input === undefined) {
            input = {
                forward: false,
                back: false,
                right: false,
                left: false,
                fire: false,
                reset: false
            };
        }
        if (input.reset !== undefined && input.reset) {
            this.init(2);
        }
        if (input.addPower !== undefined && input.addPower) {
            if (!this.adding){
                this.adding = true;
            }
        } else {
            this.adding = false;
        }

        if (this.power_manager.update()) {
            var pow = this.power_manager.getPowerup();
            this.powerUps.push({type: pow, x: 250, y: 250});
        }
        

        for (var id in this.players) {
            var player = this.players[id];
            var m = player.getMove(input);
            player.update(m.forward, m.back, m.left, m.right);
            var b = player.fire(input.fire);
            
            if (b !== undefined) {
                console.log(this.powerUps);
                console.log('shooting ' + b);
                if (b !== 'default'){
                    var bullet_class;
                    try {
                        bullet_class = require("./special_bullets/" + b);
                    } catch (e) {
                        console.log("special bullet error");
                        player.addDefaultBullet();
                        break;
                    }
                    this.bullets.push(new bullet_class(b, id,
                        player.x + Math.cos(player.a * Math.PI / 180) * 12, 
                        player.y + Math.sin(player.a * Math.PI / 180) * 12, 
                        player.a, 3, 4,
                        2));
                } else {
                    this.bullets.push(new this.bullet_gen(b, id,
                        player.x + Math.cos(player.a * Math.PI / 180) * 10, 
                        player.y + Math.sin(player.a * Math.PI / 180) * 10, 
                        player.a, 3, 4,
                        2));
                }
            }
            
            break;
        }

        for (var id in this.bullets) {
            var bullet = this.bullets[id];
            bullet.update();
            if (bullet.decayLife() || bullet.bullet_array.length === 0) {
                if (this.players[bullet.id] !== undefined) {
                    this.players[bullet.id].addDefaultBullet();
                }
                this.bullets.splice(id, 1);
            }
        }

        var player_hit = this.collision_manager.runCollisionDetection(this.players, this.walls, this.bullets, this.powerUps);
        if (player_hit) {
            
            if (this.players[player_hit] === undefined) {
                this.players_left--;
                console.log(this.players_left);
                if (this.players_left <= 1) {
                    this.init(3);
                    this.bullets = [];
                    this.powerUps = [];
                }
            }
        }

    }



}

module.exports = GameManager;