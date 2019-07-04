'use strict'

class MapGen {
    constructor (height, width){
        this.height = height;
        this.width = width;
    }

    generate_map() {
        console.log("generating map");
        var map = {};
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var tile = Math.trunc(Math.random() * 15 + 1);
                map[""+ i + j] = { tile: tile, x: i, y: j};
            }
        }
        

        this.fixInnerWalls(map);
        this.startPruning(map);
        this.fixInnerWalls(map);
        this.setSpawns(map);
        this.addOuterWalls(map);
        return map;
        
    }
    //0 + num goes to left

    addOuterWalls(map) {
        
        for (var i = 0; i < this.width; i++){
            if (map[""+0+i] === undefined) {
                map[""+0+i] = { tile: 1, x: 0, y: i};
            } else {
                if ((map[""+0+i].tile) % 2 != 1) {
                    map[""+0+i].tile += 1;//1
                }
            }
        }
        for (var i = 0; i < this.width; i++){
            var key = ""+ (this.width - 1) + i;
            if (map[key] === undefined) {
                map[key] = { tile: 4, x: 0, y: i};
            } else {
                if ((map[key].tile >> 2) % 2 != 1) {
                    map[key].tile += 4; //4
                }
            }
        }
        for (var i = 0; i < this.height; i++){
            if (map[""+i+0] === undefined) {
                map[""+i+0] = { tile: 2, x: 0, y: i};
            } else {
                if ((map[""+i+0].tile >> 1) % 2 != 1) {
                    map[""+i+0].tile += 2; //2
                }
            }
        }
        for (var i = 0; i < this.height; i++){
            var key = "" + i + (this.width - 1);
            if (map[key] === undefined) {
                map[key] = { tile: 8, x: 0, y: i};
            } else {
                if ((map[key].tile >> 3) % 2 != 1) {
                    map[key].tile += 8; //8
                }
            }
        }
        
        return;
    
    }
    //left === 1    %2
    //top === 2     >>1%2
    //right === 4   >>2%2
    //bot === 8     >>3%2

    fixInnerWalls(map){
        var cur;
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var map_space = map[this.Key(i,j)];
                var tile = map_space.tile;
                var left_wall = (tile % 2);
                var top_wall = ((tile >> 1) % 2);
                var right_wall = ((tile >>2) % 2);
                var bot_wall = ((tile >> 3) % 2);

                if (left_wall != 0 && i > 0) {
                    if ((map[this.Key(i - 1, j)].tile >> 2)% 2 === 0)
                        map[this.Key(i - 1, j)].tile += 4;
                } 
                if (top_wall != 0 && j > 0) {
                    
                    if ((map[this.Key(i, j - 1)].tile >> 3)% 2 === 0)
                        map[this.Key(i, j - 1)].tile += 8;
                
                }
                if (right_wall != 0 && i < this.width - 1) {
                    if ((map[this.Key(i + 1, j)].tile)% 2 === 0)
                        map[this.Key(i+1, j )].tile += 1;
                        
                }
                if (bot_wall != 0 && j < this.height - 1) {
                    if ((map[this.Key(i, j + 1)].tile >> 1) % 2 === 0)
                        map[this.Key(i, j + 1)].tile += 1;
                
                       
                }

            }
        }
    }

    startPruning(map) {
        for (var i = 0; i < this.width - 1; i++){
            for (var j = 0; j < this.height - 1; j++){
                var lt = map[this.Key(i,j)];
                var rt = map[this.Key(i+1,j)];
                var lb = map[this.Key(i,j+1)];
                var rb = map[this.Key(i+1,j+1)];
                this.prune(lt, rt, lb, rb);
                
                map[this.Key(i,j)] = lt;
                map[this.Key(i+1,j)] = rt;
                map[this.Key(i,j+1)] = lb;
                map[this.Key(i+1,j+1)] = rb;

            }
        }
    }

    prune(lt, rt, lb, rb){
        var sum =0;
        
        var left_top_tile = lt.tile;
        sum += (left_top_tile >> 2) % 2 + (left_top_tile >> 3) % 2;
        var right_top_tile = rt.tile;
        sum += (right_top_tile >> 3) % 2;
        var left_bot_tile = lb.tile;
        var right_bot_tile = rb.tile;
        sum += (right_bot_tile) % 2;
        var inner_sum = sum;

        sum += left_top_tile % 2 + (left_top_tile >> 1) % 2;
        sum += (right_top_tile >> 1) % 2 + (right_top_tile >> 2) % 2;
        sum += (left_bot_tile) % 2 + (left_bot_tile >> 3) % 2;
        sum += (right_bot_tile >> 2) % 2 + (right_bot_tile >> 3) % 2;
        
        if (sum > 6) {
            lt.tile = ((lt.tile >> Math.trunc(Math.random() * 3 + 1)) << Math.trunc(Math.random() * 3 + 1)) % 16;
            lb.tile = ((lb.tile >> Math.trunc(Math.random() * 3 + 1)) << Math.trunc(Math.random() * 3 + 1)) % 16;
            rt.tile = ((rt.tile >> Math.trunc(Math.random() * 3 + 1)) << Math.trunc(Math.random() * 3 + 1)) % 16;
            rb.tile = ((rb.tile >> Math.trunc(Math.random() * 3 + 1)) << Math.trunc(Math.random() * 3 + 1)) % 16;
        }
        
    }

    Key(x,y) {
        return ""+x + y;
    }

    setSpawns(map) {
        var start = {
            x: 0,
            y: 0,
            g: 0,   //travel from last to here
            h: this.getDistance(0,0,7,7)
        };
        var end = {
            x: 0,
            y: 7,
            g: 0,   //travel from last to here
            h: this.getDistance(0,0,7,7)
        }
        
        var open = [];
        var closed = [start, {x: 0, y: 3}, {x:1, y: 3}, {x: 2, y: 4}];



        console.log(this.findPath(start, end, open, closed, map, 0));

        
    }

    testPath(point) {
        var x = point.x;
        var y = point.y;

        if ((x === 0 && y === 3) || (x === 0 && y === 2)) {
            return true;
        }
       
        return false;
    }

    findPath(cur, end, open, closed, map, count){
        
        if (map[this.Key(cur.x, cur.y)].tile < 16)
            map[this.Key(cur.x, cur.y)].tile += 16;
        var tile = map[this.Key(cur.x, cur.y)].tile;
        if (cur.x === end.x && cur.y === end.y) {
            return true;
        }
        console.log(this.Key(cur.x, cur.y)+" "+this.checkWall('l', tile));
        if (cur.x > 0) {
            var p = {
                x: cur.x - 1,
                y: cur.y
            };
            if (!this.compareTo(p, closed)) {
                open.push(p);
            }

        }

        if (cur.y > 0) {
            var p = {
                x: cur.x,
                y: cur.y - 1
            };
            if (!this.compareTo(p, closed)) {
                open.push(p);
            }

        }
        if (cur.x < this.width - 1) {
            var p = {
                x: cur.x + 1,
                y: cur.y
            };
            if (!this.compareTo(p, closed)) {
                open.push(p);
            }

        }
        if (cur.y < this.height - 1) {
            var p = {
                x: cur.x,
                y: cur.y + 1
            };
            if (!this.compareTo(p, closed)) {
                open.push(p);
            }

        }
        closed.push(cur);
        if (open.length === 0) {
            return false;
        }
        var new_cur = open.pop();
        //console.log(this.stacksToString(open, closed));
        return this.findPath(new_cur, end, open, closed, map, count + 1);

    }

    stacksToString(open, closed) {
        var str = "";
        var i = 0;
        var j = 0;
        while (i < open.length || j < closed.length){
            if (i < open.length) {
                str += open[i].x + " " + open[i].y; 
                str += "\t";
                i++;
            } else {
                str += "\t";
            }
            if (j < closed.length) {
                str += closed[j].x + " " + closed[j].y; 
                j++;
            } 
            
            str += "\n";
        }
        return str;
    }

    checkWall(dir, tile) {
        //left
        //top
        //right
        //bot
        switch(dir) {
            case 't': 
                if ((tile >> 1)%2) {
                    return false;
                }
            case 'l':
                if ((tile)%2) {
                    return false;
                }
            case 'r':
                if ((tile >> 2)%2) {
                    return false;
                }
            case 'b':
                if ((tile >> 3)%2) {
                    return false;
                }
            default:
                return true;
        }
    }

    compareTo(p, stack) {
        for (var i = 0; i < stack.length; i++){
            if (stack[i].x === p.x && stack[i].y === p.y) {
                return true;
            }
        }
        return false;
    }



    insertPoint(point, stack) {
        if (this.testPath(point)){
            return false;
        }
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].h >= point.h) {
                if (!(stack[i].x === point.x && stack[i].y === point.y)) {
                    stack.splice(i, 0, point);
                    return true;
                } else {
                    return false;
                }
                
            } 
        }
        //stack.apoint);
        stack.push(point);
        return true;
    }



    getDistance(x1, y1, x2, y2) {
        return Math.abs(y1 - y2) + Math.abs(x1 - x2);
    }





}




module.exports = MapGen;