'use strict'

class Move {
    
    constructor (frame_depth) {
        this.frame_depth = frame_depth;
        this.last_update = {};
        this.testx = true;
        this.testy = true;
    }

    make_movement(player) {
        var rr = this.get_random_move(player.speed);

        var dx = rr.x;
        var dy = rr.y;
        
    
        if (this.last_update[player.id] === undefined) {
            this.last_update[player.id] = {};
            for (var i = 0; i < this.frame_depth; i++){
                this.last_update[player.id][i] = {
                    x: dx,
                    y: dy
                };
            }
        }

        for (var i = 1; i < this.frame_depth; i++){
            this.last_update[player.id][i] = this.last_update[player.id][i-1];
        }
        this.last_update[player.id][0] = {
            x: dx,
            y: dy
        };

        var sumx = 0;
        var sumy = 0;
        for (var frame in this.last_update[player.id]) {
            sumx += this.last_update[player.id][frame].x;
            sumy += this.last_update[player.id][frame].y;
        }

        sumx = Math.trunc(sumx / this.frame_depth);
        sumy = Math.trunc(sumy / this.frame_depth);

        return {
            x: sumx,
            y: sumy
        };

    }

    
   
    
    update_players(players, map) {
        for (var id in players) {
            var player = players[id];

            var update = this.make_movement(player);
            var collision = this.check_collision(player, map);
            
            if (update.x > 0){
                if (collision.right){
                    player.addX(update.x);
                }
            } else {
                if (collision.left){
                    player.addX(update.x);
                }
            }
            if (update.y > 0){
                if (collision.bot){
                    player.addY(update.y);
                }
            } else {
                if (collision.top){
                    player.addY(update.y);
                }
            }
        }

    }

    check_collision(player, map) {
        var x = player.x;
        var y = player.y;

        var mapx = Math.trunc(x / 100);
        var mapy = Math.trunc(y / 100);

        var rx = x - mapx*100;
        var ry = y - mapy*100;

        var tile = map['' + mapx + mapy].tile;
        
        var state =  {
            top: true,
            left: true,
            bot: true,
            right: true
        };

        var cells = this.getCells({x: rx, y: ry}, {x: mapx, y: mapy}, player.width, player.height, map);

        var l,t,r,b;
        

        l = tile % 2;
        t = (tile >> 1) % 2;
        r = (tile >> 2) % 2;
        b = (tile >> 3) % 2;

        if (rx < 2 && l) {
            state.left = false;
        }
        if (rx + player.width > 8 && r) {
            state.right = false;
        }
        if (ry < 2 && t) {
            state.top = false;
        }
        if (ry + player.height > 98 && b) {
            state.bot = false;
        }

        if (cells['bot'] !== undefined) {
            var bot_tile = cells['bot'].tile;
            if ((bot_tile >> 1) % 2) {
                state.left = false;
                state.bot = false;
            }
            if (((bot_tile >> 2) % 2) && (rx + player.width) > 98) {
                state.right = false;
            }
            if (((bot_tile) % 2) && (rx) < 2) {
                state.left = false;
            }

        }
        if (cells['right'] !== undefined) {
            if (((bot_tile >> 3) % 2) && (ry + player.height) > 98) {
                state.bot = false;
            }
            if (((bot_tile >> 1) % 2) && ry < 2) {
                state.top = false;
            }
            if ((bot_tile) % 2) {
                
                state.right = false;
            }
            
        }

        return state;

        
        
    }

    getCells(p_coor, map_coor, p_width, p_height, map) {
        var cells = {};
        
        if (p_coor.x + p_width > 100) {
            cells['right'] = (map[''+(map_coor.x+1)+map_coor.y]);
        }    
        if (p_coor.y + p_height > 100) {
            cells['bot'] = (map[''+map_coor.x+(map_coor.y+1)]);
        }
        
        return cells;
        
    }

    get_random_move(speed) {
        return { 
            x: Math.trunc(Math.random() * speed - speed/2),
            y: Math.trunc(Math.random() * speed - speed/2)
        };
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }


}

module.exports = Move;