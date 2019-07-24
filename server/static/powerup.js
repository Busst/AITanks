'use strict'

var bb = require('./bullet');
class powerup {
    

    constructor () {}
    

    genShotgun(id, x, y, angle) {
        var bullets = [];
        for(var i = -2; i <= 2; i++) {
            bullets.push(new bb('shotgun', id,
                x + Math.cos(angle * Math.PI / 180) * 10, 
                y + Math.sin(angle * Math.PI / 180) * 10, 
                angle + i * 15, 3, 5,
                .5));
        }
        return bullets;
    }

    genRayGun(id, x, y, angle) {
        var bullets = [];
        bullets[0] = new bb('raygun', id,
        x + Math.cos(angle * Math.PI / 180) * 10, 
        y + Math.sin(angle * Math.PI / 180) * 10, 
        angle, 10, 3,
        1);
        return bullets;
    }

}




module.exports = powerup;