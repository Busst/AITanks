'use strict'

class MapGen {
    constructor (seed){
        this.seed = seed;
    }

    generate_map_array() {
        var map_array = {};
        map_array['1'] = {
            x: 10,
            y: 10,
            w: 1,
            h: 800,
        }

    }

    get_seed(){
        return this.seed;
    }
}

module.exports = MapGen;