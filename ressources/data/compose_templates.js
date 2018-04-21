const { registerFont } = require('canvas');

/*
const template = {
    base: 'PATH',
    box: {x:0, y:0, w:0, h:0},
    boxText: {x:0, y:0, w:0, h:0}, // OPTIONAL
    boxImage: {x:0, y:0, w:0, h:0}, // OPTIONAL
    rotate: {x:0, y:0, angle: 0}, // OPTIONAL
    font: {family: 'FACENAME', size: 0, vs: 0, hs: 0, color: '#000'},
    color: '#fff'  // OPTIONAL
}
*/

registerFont('./ressources/fonts/DILBERTFONT2.ttf', {family: 'Dilbert'});
registerFont('./ressources/fonts/AnisaSans.ttf', {family: 'Anisa'});

module.exports = {
    'search': {
        base: './ressources/images/the-search.png',
        boxText: {x: 58, y: 346 - 18, w: 170, h: 18*4},
        boxImage: {x: 52, y: 326, w: 175, h: 81},
        font: {family: 'Dilbert', size: 18, hs: 5, vs: 18},
        color: '#fff'
    },
    'blu_neko': {
        base: './ressources/images/blu_neko.png',
        boxImage: {x: 180, y: 488, w: 414, h: 307},
        boxText: {x: 195, y: 506, w: 390, h: 281},
        font: {family: 'Anisa', size: 56, hs: 10},
        color: '#fff'
    },
    'hibiki': {
        base: './ressources/images/hibiki.png',
        rotate: {x: 40.00, y: 300.00, angle: -20.00},
        boxImage: {x: 36, y: 290, w: 490, h: 350},
        boxText: {x: 46, y: 308, w: 468, h: 318},
        font: {family: 'Anisa', size: 56, hs: 10},
        color: '#fff'
    }
}