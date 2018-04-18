const Jimp = require('jimp');
const helper = require('../helper');
const fs = require('fs');


const tw = 172, th = 74, tx = 54, ty = 328;
// Old legacy Jimp implem, slower and text is centered in a hacky way
async function _search_jimp(_text) {

    let font = await Jimp.loadFont('./ressources/fonts/DILBERT.fnt');
    let base = await Jimp.read('./ressources/images/the-search.png');
    let text = await new Jimp(tw, th);

    text.print(font, 3, 0, _text, tw - 8).crop(0 ,0 , tw - 2, th - 2).autocrop();

    base.composite(text, tx + (tw - text.bitmap.width) / 2, ty + (th - text.bitmap.height) / 2);

    return base;
}

const { createCanvas, loadImage, Image, registerFont } = require('canvas');

registerFont('./ressources/fonts/DILBERTFONT2.ttf', {family: 'Dilbert'});

// Centers text vertically and horizontally in x, y, w, h bounding box
// Excess /\s/ are removed for simplicity sake
// In the future, this will take ctx, text, box and options arguments
/**
 * @description Centers text vertically and horizontally in x, y, w, h bounding box, spaces with hs and vs
 * @param {ctx} context Thy node canvas context
 * @param {text} string Thy text
 * @param {x} int X pos
 * @param {y} int Y pos
 * @param {w} int Max width
 * @param {h} int Max height
 * @param {hs} int Space in pixels between words
 * @param {vs} int Space in pixels between lines start
 */
function centerText(ctx, text, x, y, w, h, hs, vs) {
    let words = helper.findAll(text, /\S+/).map(e => e[0]); // Split the words
    let sizes = words.map(e => ctx.measureText(e)); // Get the words sizes
    let lines = [];
    
    let getWidth = (from, to) => sizes.slice(from, to).reduce((a, c) => a + c.width + hs, 0); // Get text width from->to adding horizontal spacing
    
    let current = 0; // Current word
    while(current < words.length) {
        if ((lines.length + 1) * vs > h) break; // Prevent up and down bleeding
        let width, size = 1; // Width and size of the current line
        while(current + size <= words.length) {
            width = getWidth(current, current + size);
            if (width > w) {
                if (size > 1) { // If not first word, reduce size and recalc width
                    size--;
                    width = getWidth(current, current + size);
                }
                break;
            }
            size++;
        }
        lines.push({width: width, sizes: sizes.slice(current, current + size), words: words.slice(current, current + size)});
        
        current += size;
    }

    lines.forEach((line, lindex) => {
        let xoffset = 0; // Cumulative X offset for drawing words and spacing them
        line.words.forEach((word, windex) => {
            ctx.fillText(word, x + (w - line.width) / 2 + xoffset, y + (h - lines.length * vs) / 2 + lindex * vs);
            xoffset += line.sizes[windex].width + hs; // Add the current word's width and horizontal spacing
        });
    });
}

// node-canvas version, better, faster, center
async function _search_canvas(_text) {
    let base = fs.readFileSync('./ressources/images/the-search.png');
    let baseImg = new Image;
        baseImg.src = base;

    let canvas = createCanvas(baseImg.width, baseImg.height), // Create a canvas with base image dimensions
        ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff'; // Paint it ~~black~~ white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000';
    ctx.font = '18px Dilbert'; // Use our registered font
    centerText(ctx, _text, 58, 346, 170, 18*4, 5, 18);
    
    ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height); // Draw the full image on the canvas
    
    return canvas;
}

module.exports.generate = async function (text) {
    let image = await _search_canvas(text);
    return image.toBuffer();// helper.getBuffer(image, Jimp.MIME_PNG);
};