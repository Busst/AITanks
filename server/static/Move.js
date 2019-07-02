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
            
            if (collision.left) {
                if (update.x > 0) {
                    player.addX(update.x);
                }
            } else if (collision.right) {
                if (update.x < 0) {
                    player.addX(update.x);
                }
            } else {
                player.addX(update.x);
            }
            
            if (collision.top) {
                if (update.y > 0) {
                    player.addY(update.y);
                }
            } else if (collision.bot) {
                if (update.y < 0) {
                    player.addY(update.y);
                }
            } else {
                player.addY(update.y);
            }
             
            
            
        }

    }

    check_collision(player, map) {
        var x = player.x;
        var y = player.y;

        var mapx = Math.trunc(x / 100);
        var mapy = Math.trunc(y / 100);

        var tile = map['' + mapx + mapy].tile;
        
        return this.relative_pos_in_square(x, y, mapx, mapy, tile);
        
        
    }

    relative_pos_in_square(px, py, mapx, mapy, tile) {
        var rpx = px - mapx*100;
        var rpy = py - mapy*100;
        var state = {
            top: false,
            left: false,
            bot: false,
            right: false

        };
        //left wall
        if (tile % 2 > 0){
            if (rpx < 5) {
                //console.log("left wall touched");
                state.left = true;
            }
        }
        //top
        if ((tile >> 1) % 2 > 0) {
            if (rpy < 5) {
                //console.log("top wall touched");
                state.top = true;
            }
        } 
        //right
        if ((tile >> 2) % 2 > 0) {
            if (rpx > 90) {
                //console.log("right wall touched");
                state.right = true;
            }
        } 
        //bot
        if ((tile >> 3) % 2 > 0) {
            if (rpy > 90) {
                //console.log("bot wall touched");
                state.bot = true;
            }
        } 

        if ((rpx > 91 || rpx < 3 || rpy > 91 || rpy < 3) && (state.left || state.right || state.top || state.bot)){
            //console.log("in weird spot " + rpx + " " + rpy);
        }
        return state;
        
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