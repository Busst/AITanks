'use strict'

var bb = require('../bullet');

class rocket extends bb{

    constructor (type, id, x, y, a, speed, radius, life) {
        super (type, id, x, y, a, speed, radius, life);

    }

    makePlayerTestable() {
        
        if (this.max_life - 25 === this.life) {
            this.player_testable = true;
        }
    }

    update(wx, wy, ps) {
        var player;
        var test,dis;

        
        

        for (var id in this.bullet_array) {
            for (var p_id in ps) {
                if (this.id === p_id && !this.player_testable) continue;
                test = this.getDistance(ps[p_id], this.bullet_array[id]);
                if (dis === undefined || test < dis){
                    dis = test;
                    player = {
                        x: ps[p_id].x,
                        y: ps[p_id].y
                    };
                }
            }
        }
        if (dis === undefined) {
            return;
        }
        
        if (player === undefined) {
            player = {x: 250, y: 250};
        }
        for (var id in this.bullet_array) {
            
            if (!this.player_testable) {
                this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
                this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
                continue;
            } 

            var x = Math.trunc(this.bullet_array[id].x / 100);
            var y = Math.trunc(this.bullet_array[id].y / 100);
            var end_x = Math.trunc(player.x / 100);
            var end_y = Math.trunc(player.y / 100);
            var node = {
                f: 0,
                g: 0,
                x: x,
                y: y
            };
            var end_node = {
                f: 0,
                g: 0,
                x: end_x,
                y: end_y
            };
            var open = [node];
            var visited = [];
            if (this.life % 20 === 0 || this.path === undefined){
                this.pathfinding(open, visited, wx, wy, node, end_node);
                this.path = this.drawBack(visited[visited.length - 1]);
            }
            
            var damp = 12;
            if (this.path.length > 1) {
                //move along to shorten distance
                var angle= this.bullet_array[id].a;
                
                var fx = this.path[this.path.length - 2].x - x;
                var fy = this.path[this.path.length - 2].y - y;
                if (fx < 0) {
                    //180
                    angle+= (180 - angle) * 1 / damp;
                } else if (fx > 0){
                // angle+= (0 - angle) * 1 / 4;
                    if (angle > 180) {
                        angle += (360 - angle)/ damp;
                        angle = angle % 360;
                        
                    } else {
                        angle -= angle / damp;
                        
                    }

                } if (fy < 0) {
                    if (angle > 90) angle+= (270 - angle) * 1 / damp;
                    else angle = 360 - (270 - angle) * 1 / damp;
                } else if (fy > 0){
                    if (angle < 270) angle+= (90 - angle) * 1 / damp;
                    else angle= -(90 - angle) * 1 / damp;
                }

                this.bullet_array[id].a = angle;

            } else {
                //start trying to close on player
                var target_x = player.x;
                var target_y = player.y;
                var this_x = this.bullet_array[id].x;
                var this_y = this.bullet_array[id].y;
                var slope = (target_y - this_y) / (target_x - this_x);
                var angle = Math.atan(slope)*180 / Math.PI + 360;
                
                if (target_x > this_x) {
                    
                    this.bullet_array[id].a = (this.bullet_array[id].a + angle) / 2;
                } else {
                    angle += 180;
                    angle = angle % 360;
                    this.bullet_array[id].a = (this.bullet_array[id].a + angle) / 2;
                }
                


            }
            this.bullet_array[id].x += Math.cos(this.bullet_array[id].a * Math.PI / 180) * this.speed;
            this.bullet_array[id].y += Math.sin(this.bullet_array[id].a * Math.PI / 180) * this.speed;
        }
    }

    drawBack(cur){
        var path = [];
        while (cur !== undefined) {
            path.push(cur);
            cur = cur.prev;

        }
        return path;
    }

    pathfinding(unvisited, visited, mapx, mapy, cur, goal) {
        if (unvisited.length === 0) {
            console.log("no path found");
            return;
        }
        if (this.in(cur, [goal])) {
            return;
        }
        /** 
         * if goal return path
         */
        //pop
        //add to visited
        
        //cur = this.dequeue(unvisited);
        cur = unvisited.pop();
        visited.push(cur);
        
        var x = cur.x;
        var y = cur.y;

        //g(n) = value of starting to n
        //h(n) = estimated cost of n to goal
        //f(n) = lowest g(n) + h(n)
        if (mapx[''+x+y] === undefined && !(this.in({x: x-1, y: y}, visited))) {
            
            var node = {x: x-1, y: y, g: cur.g+1};
            this.calculateNode(node, goal, cur, unvisited);
            
        }
        if (mapy[''+x+y] === undefined && !this.in({x: x, y: y-1}, visited)) {
            
            var node = {x: x, y: y-1, g: cur.g+1};
            this.calculateNode(node, goal, cur, unvisited);
        }
        if (mapx[''+(x+1)+y] === undefined && !this.in({x: x+1, y: y}, visited)) {
            
            var node = {x: x+1, y: y, g: cur.g+1};
            this.calculateNode(node, goal, cur, unvisited);
        }
        if (mapy[''+x+(y+1)] === undefined && !this.in({x: x, y: y+1}, visited)) {
            
            var node = {x: x, y: y+1, g: cur.g+1};
            this.calculateNode(node, goal, cur, unvisited);
        }

        this.pathfinding(unvisited, visited, mapx, mapy, cur, goal);
        


    }

    calculateNode(node, goal, cur, unvisited) {
        node.f = node.g + this.getDistance(node, goal);
        node.prev = cur;
        if (this.in(node, unvisited)) {
            var id = this.getID(node, unvisited);
            if (node.f < unvisited[id]) {
                unvisited[id] = node;
                
            }
        } else {
            this.insert(node, unvisited);
        }
    }

    getID(node, a) {
        for (var id in a) {
            var coor = a[id];
            if (coor.x === node.x && coor.y === node.y) {
                return id;
            }
        }
        return false;
    }

    dequeue(a) {
        var node = {
            x: a[0].x,
            y: a[0].y,
            g: a[0].g,
            f: a[0].f,
            prev: a[0].prev
        };
        a.splice(0, 1);
        return node;

    }

    insert(node, a) {
        
        for (var id in a) {
            if (a[id].f < node.f) {
                a.splice(id, 0, node);
                return;
            }
        }
        a.push(node);
    }

    getDistance(start, goal) {
        var x = Math.pow(start.x - goal.x,2);
        var y = Math.pow(start.y - goal.y,2);
        return Math.sqrt(x + y);
    }
    
    
    in(node, a) {
        for (var id in a) {
            var coor = a[id];
            if (coor.x === node.x && coor.y === node.y) {
                return true;
            }
        }
        return false;
    }


}

module.exports = rocket;