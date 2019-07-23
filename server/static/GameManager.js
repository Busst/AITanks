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
        var pp = require('./powerup');
        var cm = require('./CollisionManager');
        this.collision_manager = new cm(grid_size);
        this.power_gen = new pp();
        
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

        for (var i = 1; i <= player_num - 1; i++) {
            //this.players[''+i] = new this.player_gen(''+i, this.spawn['p'+i].x*100 + 20, this.spawn['p'+i].y*100+50, 7, 'red', 30, 20);
        }
        this.players[''+1] = new this.player_gen(''+1, this.spawn['p'+1].x*100 + 20, this.spawn['p'+1].y*100+50, 7, 'red', 30, 20);
        this.players[''+2] = new this.player_gen(''+2, this.spawn['p'+2].x*100 + 20, this.spawn['p'+2].y*100+50, 7, 'green', 30, 20);
        this.players[''+i] = new this.player_gen(''+3, this.spawn['p'+3].x*100 + 20, this.spawn['p'+3].y*100+50, 7, 'blue', 30, 20);

        
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
                this.addPowerUps();
                this.adding = true;
            }
        } else {
            this.adding = false;
        }
        

        for (var id in this.players) {
            var player = this.players[id];
            var m = player.getMove(input);
            player.update(m.forward, m.back, m.left, m.right);
            var b = player.fire(input.fire);
            if (b !== undefined) {
                console.log('shooting ' + b);
                if (b === 'default'){
                    this.bullets[this.bullets.length] = new this.bullet_gen(b, id,
                        player.x + Math.cos(player.a * Math.PI / 180) * 10, 
                        player.y + Math.sin(player.a * Math.PI / 180) * 10, 
                        player.a, 3, 4,
                        2);
                }
            }
            
            break;
        }
        var player_hit = this.collision_manager.runCollisionDetection(this.players, this.walls, this.bullets, this.powerUps);
        if (player_hit) {
            this.players_left--;
            if (this.players_left <= 1) {
                this.init(3);
            }
        }

    }

    addPowerUps() {
        console.log("adding powerup");
        
        this.powerUps.push({type: 'shotgun', x: 2*100+50, y: 2*100+50});
        

    }


}

module.exports = GameManager;