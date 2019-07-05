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
        

        this.startPruning(map);
        this.fixInnerWalls(map);
        this.addOuterWalls(map);
        var players = this.setSpawns(map);
        return {map, spawn: players};
        
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

        for (var i = 0; i < this.width; i++){
            for (var j = 0; j < this.height; j++) {
                var key = this.Key(i,j);
                var tile = map[key].tile;
                if (tile % 2&& i > 0) {
                    var left_key = this.Key(i-1,j);
                    var left_tile = map[left_key].tile;
                    if (!((left_tile >> 2) % 2)){
                        map[left_key].tile = (map[left_key].tile + 4) % 16;
                        //console.log("left " + this.Key(i-1,j)+" "+tile + " " + ((map[this.Key(i-1,j)].tile >> 2)%2));
                    }
                    
                }
                
                if ((tile >> 1) % 2 && j > 0) {
                    var top_key = this.Key(i,j-1);
                    var top_tile = map[top_key].tile;
                    if (!((top_tile >> 3) % 2)){
                        map[top_key].tile = (map[top_key].tile + 8) % 16;
                        //console.log("top " + this.Key(i+1,j)+" "+tile + " " + ((map[this.Key(i,j-1)].tile >> 3)%2));
                    }
                }
                if ((tile >> 2) % 2&& i < this.width-1) {
                    var right_key = this.Key(i+1,j);
                    var right_tile = map[right_key].tile;
                    if (!((right_tile) % 2)){
                        map[right_key].tile = (map[right_key].tile + 1) % 16;
                        //console.log("right " + this.Key(i+1,j)+" "+tile + " " + ((map[this.Key(i+1,j)].tile)%2));
                    }
                }
                if ((tile >> 3) % 2 && j < this.height - 1) {
                    var bot_key = this.Key(i,j+1);
                    var bot_tile = map[bot_key].tile;
                    if (!((bot_tile >> 1) % 2)){
                        map[bot_key].tile = (map[bot_key].tile + 2) % 16;
                        //console.log("adding ");
                        //console.log("bot " + this.Key(i,j+1)+" "+tile + " " + ((map[this.Key(i,j+1)].tile >> 1)%2));
                    }
                    
                }


                map[key].tile = map[key].tile % 16;
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
            x: 4,
            y: 4
        }

        var p1x = Math.trunc(Math.random() * 7);
        var p1y = Math.trunc(Math.random() * 7);
        var p2x = Math.trunc(Math.random() * 7);
        var p2y = Math.trunc(Math.random() * 7);
        var p3x = Math.trunc(Math.random() * 7);
        var p3y = Math.trunc(Math.random() * 7);
        
        while ((p1x === p2x && p2y === p1y) || (p1x === p3x && p3y === p1y) || (p2x === p3x && p2y === p3y) ) {
                
            if (p1x === p2x && p2y === p1y) {
                p2x = Math.trunc(Math.random() * 7);
                p2y = Math.trunc(Math.random() * 7);
            } else {
                p3x = Math.trunc(Math.random() * 7);
                p3y = Math.trunc(Math.random() * 7);
            }
        }
        var p1 = {
            x: p1x,
            y: p1y
        };
        var p2 = {
            x: p2x,
            y: p2y
        };
        var p3 = {
            x: p3x,
            y: p3y
        };

        var open = [];
        var closed = [];



        while (!this.findPath(p1, p2, open, closed, map)) {
 
            var open = [];
            var closed = [];
            
            p2x = Math.trunc(Math.random() * 7);
            p2y = Math.trunc(Math.random() * 7);
            while (p1x === p2x && p2y === p1y) {
                
                p2x = Math.trunc(Math.random() * 7);
                p2y = Math.trunc(Math.random() * 7);
            }
            
            p2 = {
                x: p2x,
                y: p2y
            };
            
 
        }

        while (!this.findPath(p1, p3, open, closed, map)) {
 
            var open = [];
            var closed = [];
            
            p3x = Math.trunc(Math.random() * 7);
            p3y = Math.trunc(Math.random() * 7);
            while (p1x === p3x && p3y === p1y || p2x === p3x && p2y === p3y) {
                
                p3x = Math.trunc(Math.random() * 7);
                p3y = Math.trunc(Math.random() * 7);
            }
            
            p3 = {
                x: p3x,
                y: p3y
            };
            
 
        }
        


        return {p1, p2, p3};
        
    }

    testPath(point) {
        var x = point.x;
        var y = point.y;

        if ((x === 0 && y === 1) || (x === 0 && y === 2)) {
            //return true;
        }
        if (y === 0 && x === 1){
            //return true;
        }
       
        return false;
    }

    findPath(cur, end, open, closed, map, count){
        
        
        var tile = map[this.Key(cur.x, cur.y)].tile;
        //if (tile < 16)
        //    map[this.Key(cur.x, cur.y)].tile += 16;
        if (cur.x === end.x && cur.y === end.y) {
            return true;
        }
        //var str = "" + this.Key(cur.x, cur.y) + " " + tile+ "\n";
        if (cur.x > 0 && !(tile % 2)) {
            //str += "\tleft wall " + (tile % 2) + "\n";
            var p = {
                x: cur.x - 1,
                y: cur.y
            };
            if (!this.compareTo(p, closed) && !this.compareTo(p, open) && !this.testPath(p)) {
                open.push(p);
            }

        }

        if (cur.y > 0 && !((tile >> 1) % 2)) {
            //str += "\ttop wall " + ((tile >> 1) % 2) + "\n";
            
            var p = {
                x: cur.x,
                y: cur.y - 1
            };
            if (!this.compareTo(p, closed) && !this.compareTo(p, open)  && !this.testPath(p)) {
                open.push(p);
            }

        }
        if (cur.x < this.width - 1 && !((tile >> 2) % 2) ) {
            //str += "\tright wall " + ((tile >> 2) % 2) + "\n";
            
            var p = {
                x: cur.x + 1,
                y: cur.y
            };
            if (!this.compareTo(p, closed) && !this.compareTo(p, open) && !this.testPath(p)) {
                open.push(p);
            }

        }
        if (cur.y < this.height - 1 && !((tile >> 3) % 2)) {
            //str += "\tbot wall " + ((tile >> 3) % 2) + "\n";
            
            var p = {
                x: cur.x,
                y: cur.y + 1
            };
            if (!this.compareTo(p, closed) && !this.compareTo(p, open) && !this.testPath(p)) {
                open.push(p);
            }

        }
        //console.log(str);
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


    compareTo(p, stack) {
        for (var i = 0; i < stack.length; i++){
            if (stack[i].x === p.x && stack[i].y === p.y) {
                return true;
            }
        }
        return false;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.abs(y1 - y2) + Math.abs(x1 - x2);
    }





}




module.exports = MapGen;