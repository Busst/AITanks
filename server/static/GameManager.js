'use strict'

class GameManager {

    constructor () {
        this.players = {};
        this.bullets = [];
        this.powerUps = [];
        this.map;
        this.walls;
        this.events = {
            'hit': false,
            'bullet': false,
            'pow_spawn': false,
            'pickup': false
        };
        this.map_gen = require('./MapGen');
        this.player_gen = require('./player');
        this.bullet_gen = require('./bullet');
        
        this.players_left = 0;
        this.adding = false;
        this.wins = {};

    }

    /**
     * generates map, players, spawns
     * 
     */
    init(player_num) {
        var gen = new this.map_gen(this.grid_size, this.grid_size, 4, 100);
        this.grid_size = Math.trunc(Math.random() * 4) + 5 + Math.trunc(Math.random() * 4) - 2;
        console.log(this.grid_size);
        var map_obj = gen.generate_map(this.grid_size);
        this.spawn = map_obj.spawn;
        this.walls = map_obj.walls;
        this.players_left = player_num;
        
        console.log("player 1 spawn: {" + this.spawn.p1.x + ", " + this.spawn.p1.y + "}");
        console.log("player 2 spawn: {" + this.spawn.p2.x + ", " + this.spawn.p2.y + "}");
        console.log("player 3 spawn: {" + this.spawn.p3.x + ", " + this.spawn.p3.y + "}");

        this.players[''+1] = new this.player_gen(''+1, this.spawn['p'+1].x*100 + 50, this.spawn['p'+1].y*100+50, 7, 'red', 30, 20);
        this.players[''+2] = new this.player_gen(''+2, this.spawn['p'+2].x*100 + 50, this.spawn['p'+2].y*100+50, 7, 'green', 30, 20);
        this.players[''+3] = new this.player_gen(''+3, this.spawn['p'+3].x*100 + 50, this.spawn['p'+3].y*100+50, 7, 'blue', 30, 20);
        for (var id in this.players) {
            this.wins[id] = 0;
        }
        var pm = require('./PowerupManager');
        this.power_manager = new pm({up_down: this.walls.x_walls, left_right: this.walls.y_walls}, {x: this.spawn['p'+1].x, y: this.spawn['p'+1].y});
        
        var cm = require('./CollisionManager');
        this.collision_manager = new cm(this.grid_size);

        this.game_timer = 250;
        
    }



    UpdateGame(input, ai_input) {
        this.compilePlayerData();


        if (this.events['hit']) this.events['hit'] = false;
        if (this.events['bullet']) this.events['bullet'] = false;
        if (this.events['pow_spawn']) this.events['pow_spawn'] = false;
        if (this.events['pickup']) this.events['pickup'] = false;
        
        
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
            var spawn = this.power_manager.getPowerSpawn();
            if (spawn !== null){
                this.powerUps.push({pow, x: spawn.x*100 + 50, y: spawn.y*100+50});
                this.events['pow_spawn'] = true;
                console.log(pow + " spawned");
            }

        }
        

        for (var id in this.players) {
            var player = this.players[id];
            var m = player.getMove(ai_input);
            var tt = player.getMove(input);
            m.forward = m.forward || tt.forward;
            m.right = m.right || tt.right;
            m.left = m.left || tt.left;
            m.back  = m.back || tt.back;
            player.update(m.forward, m.back, m.left, m.right);
            var b = player.fire(input.fire);
            
            if (b !== undefined) {
                console.log('player '+ id + ' shooting ' + b);
                this.events['bullet'] = true;
                if (b !== 'default'){
                    var bullet_class;
                    try {
                        bullet_class = require("./special_bullets/" + b);
                    } catch (e) {
                        console.log("special bullet error");
                        player.addDefaultBullet();
                        console.log(e)
                        break;
                    }
                    this.bullets.push(new bullet_class(b, id,
                        player.x + Math.cos(player.a * Math.PI / 180) * 12, 
                        player.y + Math.sin(player.a * Math.PI / 180) * 12, 
                        player.a, 3, 4,
                        5));
                } else {
                    this.bullets.push(new this.bullet_gen(b, id,
                        player.x + Math.cos(player.a * Math.PI / 180) * 10, 
                        player.y + Math.sin(player.a * Math.PI / 180) * 10, 
                        player.a, 3, 4,
                        3.5));
                }
            }
            
            break;
        }

        for (var id in this.bullets) {
            var bullet = this.bullets[id];
            if (bullet.type !== 'rocket') {
                bullet.update();
            } else {
                bullet.update(this.walls.x_walls, this.walls.y_walls, this.players);
            }
            
            if (bullet.decayLife() || bullet.bullet_array.length === 0) {
                if (this.players[bullet.id] !== undefined) {
                    this.players[bullet.id].addDefaultBullet();
                }
                this.bullets.splice(id, 1);
            }
        }

        var player_hit = this.collision_manager.runCollisionDetection(this.players, this.walls, this.bullets, this.powerUps, this.events);
        if (player_hit) {
            console.log("player " + player_hit + " hit");

            this.events['hit'] = true;
            if (this.players[player_hit] === undefined) {
                this.players_left--;
            }
        }
        if (this.players_left <= 1) {
            this.game_timer--;
        }
        if (this.game_timer === 0) {
            for (var id in this.players) {
                this.wins[id]++;
            }
            console.log("wins");
            for (var id in this.wins) {
                console.log("\tplayer " + id + ": " + this.wins[id]);
            }
            this.init(3);
            this.bullets = [];
            this.powerUps = [];
        }

    }

    compilePlayerData() {
        var pack = {};
        var bullet_string = "";
        var power_string = "";
        var player_string = "";
        for (var b_id in this.bullets) {
            var bullet = this.bullets[b_id];
            bullet_string += bullet.toString();
        }
        for (var p_id in this.powerUps) {
            var power = this.powerUps[p_id];
            power_string += this.power_manager.toString(power);
        }
        for (var p_id in this.players) {
            var player = this.players[p_id];
            player_string += player.toString();
        }
        for (var id in this.players) {
            var player = this.players[id];
            var wall_string = id + '\n' + this.wallsToString(player.x, player.y);
            pack[id] = {
                me: player.toString(),
                walls: wall_string,
                players: player_string,
                pickups: power_string,
                bullets: bullet_string
            }
            
        }

        this.pack = pack;
    }

    wallsToString(p_x, p_y) {
        var out = "";
        var walls_skimmed = [];
        var x = Math.trunc(p_x / 100);
        var y = Math.trunc(p_y / 100);
        
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (x+i >= 0 && x+i <= this.grid_size && y+j >= 0 && y+j <= this.grid_size ) {
                    walls_skimmed.push(""+(x+i) + (y + j));        
                }
            }
        }
        for (var id in walls_skimmed) {
            var wall = this.walls.x_walls[walls_skimmed[id]];
            if (wall === undefined) {continue;}
            out += '\t(' + wall.x + ', ' + wall.x2 + ', ' + wall.y + ', ' + wall.y2 + ')\n';
            wall = this.walls.y_walls[walls_skimmed[id]];
            if (wall === undefined) {continue;}
            out += '\t(' + wall.x + ', ' + wall.x2 + ', ' + wall.y + ', ' + wall.y2 + ')\n';

        }
        return out;
    }



}

module.exports = GameManager;