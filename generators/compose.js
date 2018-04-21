const helper = require('../helper');
const fs = require('fs');
const { createCanvas, Image, registerFont } = require('canvas');

const template = {
    base: 'PATH',
    box: {x:0, y:0, w:0, h:0},
    boxText: {x:0, y:0, w:0, h:0},
    boxImage: {x:0, y:0, w:0, h:0},
    rotate: {x:0, y:0, angle: 0},
    font: {family: 'FACENAME', size: 0, vs: 0, hs: 0, color: '#000'},
    color: '#fff'
}

async function _compose(template, options) {
    let base = fs.readFileSync(template.base);
    let baseImage = new Image;
        baseImage.src = base;

    let canvas = createCanvas(baseImage.width, baseImage.height), // Create a canvas with base image dimensions
        ctx = canvas.getContext('2d');

    if (template.color) {
        ctx.fillStyle = template.color; // Paint it ~~black~~ color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (template.rotate) {
        ctx.save();
        ctx.translate(template.rotate.x, template.rotate.y);
        ctx.rotate(template.rotate.angle*Math.PI/180);
        ctx.translate(-template.rotate.x, -template.rotate.y);
    }

    if (options.image === '' || options.image === undefined) {
        ctx.fillStyle = helper.def(template.font.color, '#000');
        ctx.font = `${template.font.size}px ${template.font.family}`;
        helper.drawText(ctx, options.text,
                        helper.def(template.boxText, template.box),
                        helper.def(template.font.hs, 5),
                        helper.def(template.font.vs, template.font.size),
                        {offsetY: template.font.size});
    } else {
        let image = new Image;
            image.src = await helper.getImage(options.image);
        helper.drawImage(ctx, image, helper.def(template.boxImage, template.box), {mode: options.mode});
    }
    
    if (template.rotate) {
        ctx.restore();
    }

    ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height); // Draw the full image on the canvas

    return canvas;
}

module.exports.generate = async function (_template, _text, _image, _mode) {
    let image = await _compose(_template, {text: _text || 'I forgot to input some text or image', image: _image, mode: _mode});
    return image.toBuffer();
};