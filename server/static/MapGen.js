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
                var tile = /*Math.trunc(Math.random() * 15 + 1)*/0;
                map[""+ i + j] = { tile: tile, x: i, y: j};
            }
        }
        //this.addInnerWalls(map);
        this.addOuterWalls(map);
        //this.pathfinder(map);
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
    //left === 1
    //top === 2
    //right === 4
    //bot === 8
    

    returnKey(x,y) {
        return ""+x + y;
    }





}




module.exports = MapGen;