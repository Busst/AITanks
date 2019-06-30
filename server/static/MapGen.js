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
        this.addOuterWalls(map);
        this.pathfinder(map);
        return map;
        
    }
    //0 + num goes to left

    addOuterWalls(map) {
        
        for (var i = 0; i < this.width; i++){
            if (map[""+0+i] === undefined) {
                map[""+0+i] = { tile: 1, x: 0, y: i};
            } else {
                if ((map[""+0+i].tile) % 2 != 1) {
                    map[""+0+i].tile += 1;
                }
            }
        }
        for (var i = 0; i < this.width; i++){
            if (map[""+ (this.width - 1) + i] === undefined) {
                map[""+ (this.width - 1) + i] = { tile: 4, x: 0, y: i};
            } else {
                if ((map[""+ (this.width - 1) + i].tile >> 2) % 2 != 1) {
                    map[""+ (this.width - 1) + i].tile += 4;
                }
            }
        }
        for (var i = 0; i < this.height; i++){
            if (map[""+i+0] === undefined) {
                map[""+i+0] = { tile: 2, x: 0, y: i};
            } else {
                if ((map[""+i+0].tile >> 1) % 2 != 1) {
                    map[""+i+0].tile += 2;
                }
            }
        }
        for (var i = 0; i < this.height; i++){
            if (map["" + i + (this.width - 1)] === undefined) {
                map["" + i + (this.width - 1)] = { tile: 8, x: 0, y: i};
            } else {
                if ((map["" + i + (this.width - 1)].tile >> 3) % 2 != 1) {
                    map["" + i + (this.width - 1)].tile += 8;
                }
            }
        }
        
        
    
        return;
    
    }

    pathfinder(map) {
        var start_x = 0;
        var start_y = 0;
        var end_x = 4;
        var end_y = 0;

        map[this.returnKey(start_x, start_y)].tile += 16;
        map[this.returnKey(end_x, end_y)].tile += 16;

        this.traverse(start_x, start_y, end_x, end_y);

    }

    traverse(x, y, end_x, end_y){

        
    }

    returnKey(x,y) {
        return ""+x + y;
    }

}




module.exports = MapGen;