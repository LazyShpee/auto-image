const helper = require('../helper');
const fs = require('fs');
const { createCanvas, loadImage, Image, registerFont } = require('canvas');

registerFont('./ressources/fonts/DILBERTFONT2.ttf', {family: 'Dilbert'});

// node-canvas version, better, faster, center
async function _search_canvas(_text, _image, _mode) {
    let base = fs.readFileSync('./ressources/images/the-search.png');
    let baseImg = new Image;
        baseImg.src = base;

    let canvas = createCanvas(baseImg.width, baseImg.height), // Create a canvas with base image dimensions
        ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff'; // Paint it ~~black~~ white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (_image === '' || _image === undefined) {
        ctx.fillStyle = '#000';
        ctx.font = '18px Dilbert'; // Use our registered font
        helper.drawText(ctx, _text, {x: 58, y: 346, w: 170, h: 18*4}, 5, 18);
    } else {
        let image = new Image;
            image.src = await helper.getImage(_image);
        helper.drawImage(ctx, image, {x: 52, y: 326, w: 175, h: 81}, {mode: _mode});
    }

    ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height); // Draw the full image on the canvas

    return canvas;
}

module.exports.generate = async function (_text, _image, _mode) {
    let image = await _search_canvas(_text || 'I forgot to input some text or image', _image, _mode);
    return image.toBuffer();// helper.getBuffer(image, Jimp.MIME_PNG);
};