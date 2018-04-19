const helper = require('../helper');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');


function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return [ h, s, l ];
}

function hslToRgb(h, s, l) {
    var r, g, b;
    
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [ r * 255, g * 255, b * 255 ];
}

/**
 * @description Colorises layers
 * @param {Array} stack {path: 'PATH', color: {r: 255, g: 255, b: 255}}, color is optional
 */
async function _colorize(stack) {
    let canvas, ctx, image = new Image;
    stack.forEach(element => {
        image.src = fs.readFileSync(element.path);
        let tmpCanvas = createCanvas(image.width, image.height);
        let tmpCtx = tmpCanvas.getContext('2d');
        tmpCtx.drawImage(image, 0, 0);
        
        if (element.color) { // If a color exists, colorize, if not just skip to use as normal layer
            let imageData = tmpCtx.getImageData(0, 0, image.width, image.height);
            let colorHSL = rgbToHsl(element.color.r, element.color.g, element.color.b);
            for (let i = 0; i < imageData.data.length; i += 4) {
                let hsl = rgbToHsl(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]);
                let rgb = hslToRgb(colorHSL[0], colorHSL[1], hsl[2]); // C(H) C(L) C(S) = A(H) A(L) B(S)
                imageData.data[i + 0] = rgb[0];
                imageData.data[i + 1] = rgb[1];
                imageData.data[i + 2] = rgb[2];
            }
            tmpCtx.putImageData(imageData, 0, 0);
        }
        
        if (canvas === undefined) { // If canvas isn't defined, use the current one
            canvas = tmpCanvas;
            ctx = tmpCtx;
        } else { // Or draw the current one on the existing canvas
            ctx.drawImage(tmpCanvas, 0, 0);
        }
    });
    
    return canvas;
}

module.exports.generate = async function (stack) {
    let image = await _colorize(stack);
    return image.toBuffer();
};