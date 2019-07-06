'use strict'

class Move {
    
    constructor (frame_depth) {
        this.frame_depth = frame_depth;
        this.last_update = {};
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
            sumx += this.last_update[player.id][frame].x -1;
            sumy += this.last_update[player.id][frame].y -1;
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
            /*
            if (collision.left) {
                if (update.x > 0){
                    player.addX(update.x);
                }
            }
            if (collision.right) {
                if (update.x < 0){
                    player.addX(update.x);
                }
            }
            if (collision.top) {
                if (update.y < 0){
                    player.addY(update.y);
                }
            }
            if (collision.bot) {
                if (update.y > 0){
                    player.addY(update.y);
                }
            }
            */
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

        
        /*
        if (cells['right'] !== undefined) {
            var cell_overshot_x = x + player.width - (mapx+1) *100; 
            if ((cells['right'].tile) % 2)
                player.addX(-(cell_overshot_x));
        } 
        if (cells['bot'] !== undefined) {
            var cell_overshot_y = y + player.height - (mapy+1) *100;
            if ((cells['bot'].tile >> 3) % 2)
                player.addY(-(cell_overshot_y));
        }
        */
        

        return state;

        
        
    }

    getCells(p_coor, map_coor, p_width, p_height, map) {
        var cells = {};
        cells['mid'] = (map[''+map_coor.x+map_coor.y]);
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