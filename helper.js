const axios = require('axios');
const Url = require('url');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function def(val, defVal) {
    return val === undefined ? defVal : val;
}

function getBuffer(image, mime) {
    return new Promise((resolve, reject) => {
        image.getBuffer(mime, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
}

function distance(x, y, cx, cy) {
    let a = x - cx;
    let b = y - cy;

    return Math.sqrt(a * a + b * b);
}

function _checkImageType(type) {
    switch (type) {
        case 'image/jpeg':
            break;
        case 'image/png':
            break;
        case 'image/gif':
            break;
        default:
            throw new Error(`Filetype ${type} is not supported`);
    }
}

async function getImage(imageUrl) {
    let url = verifyUrl(imageUrl);
    let head = await axios.head(url.href);
    _checkImageType(head.headers['content-type']);
    let request = await axios.get(url.href, {responseType: 'arraybuffer'});
    return request.data;
}

function verifyUrl(url) {
    return Url.parse(url);
}

/**
 * @description Returns all matches of re on sourceString
 * @param {string} sourceString Thy string
 * @param {RegExp} re Thy regexp
 */
function findAll(sourceString, re, aggregator = []) {
    const arr = re.exec(sourceString);

    if (arr === null) return aggregator;

    const newString = sourceString.slice(arr.index + arr[0].length);
    return findAll(newString, re, aggregator.concat([arr]));
}

/**
 * @description Draws text in a box, excess /\S/ are removed
 * @param {CanvasRenderingContext2D} ctx Canvas context to draw on
 * @param {string} text Text to write
 * @param {Array} box 
 * @param {number} hs Horizontal separation (pixels between words)
 * @param {number} vs Vertical separation (pixels between starts of a line)
 * @param {Array} options {stroke: false}
 */
function drawText(ctx, text, box, hs, vs, options) {
    options = options || {};
    let words = findAll(text, /\S+/).map(e => e[0]); // Split the words
    let sizes = words.map(e => ctx.measureText(e)); // Get the words sizes
    let lines = [];
    
    let getWidth = (from, to) => sizes.slice(from, to).reduce((a, c) => a + c.width + hs, 0); // Get text width from->to adding horizontal spacing
    
    let current = 0; // Current word
    while(current < words.length) {
        if ((lines.length + 1) * vs > box.h) break; // Prevent up and down bleeding
        let width, size = 1; // Width and size of the current line
        while(current + size <= words.length) {
            width = getWidth(current, current + size);
            if (width > box.w) {
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
            ctx.fillText(word, box.x + (box.w - line.width) / 2 + xoffset + def(options.offsetX, 0), box.y + (box.h - lines.length * vs) / 2 + lindex * vs + def(options.offsetY, 0));
            if (options.stroke)
                ctx.strokeText(word, box.x + (box.w - line.width) / 2 + xoffset + def(options.offsetX, 0), box.y + (box.h - lines.length * vs) / 2 + lindex * vs + def(options.offsetY, 0));
            xoffset += line.sizes[windex].width + hs; // Add the current word's width and horizontal spacing
        });
    });
}

const _modes = ['fit', 'fill'];
/**
 * @description
 * @param {CanvasRenderingContext2D} ctx Canvas context to draw on
 * @param {Image} image Image to scale
 * @param {Array} box Bounding box with x, y, w and h attributes
 * @param {Array} options mode: 'fit' or 'fill'
 */
function drawImage(ctx, image, box, options) {
    options = options || {};
    let mode = _modes.includes(options.mode) ? options.mode : 'fit';
    let w = image.width,
        h = image.height,
        ri = h / w,
        rb = box.w / box.h;

    switch(mode) {
        case 'fill':
            if (rb < ri) {
                h *= box.w / w;
                w = box.w;
            } else {
                w *= box.h / h;
                h = box.h;
            }
            break;
        case 'fit':
            if (rb > ri) {
                h *= box.w / w;
                w = box.w;
            } else {
                w *= box.h / h;
                h = box.h;
            }
            break;
    }
    ctx.drawImage(image, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
}

module.exports = {getRandomArbitrary, def, getBuffer, distance, findAll, getImage, verifyUrl, drawImage, drawText};