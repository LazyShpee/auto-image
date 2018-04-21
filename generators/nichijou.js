const helper = require('../helper');
const fs = require('fs');
const GIFEncoder = require('gifencoder');
const { createCanvas, Image, registerFont } = require('canvas');

require('string-format-js');

async function _simpleGifText(frameData) {
    let canvas = createCanvas(frameData.metadata.w, frameData.metadata.h);
    let ctx = canvas.getContext('2d');
    let image = new Image;

    var encoder = new GIFEncoder(frameData.metadata.w, frameData.metadata.h);
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(frameData.metadata.delay);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.font = '%dpx Sans'.format(frameData.metadata.size);
    
    

    let currentText;
    for (let n = 0; n < frameData.metadata.count; n++) {
        image.src = fs.readFileSync(frameData.metadata.filename.format(n));
        
        ctx.drawImage(image, 0, 0);

        if (frameData[n]) currentText = frameData[n];
        if (currentText && currentText.text) {
            // Draw text
            helper.drawText(ctx, currentText.text, currentText.box, 10, frameData.metadata.size, {offsetY: frameData.metadata.size, stroke: true});
        }

        encoder.addFrame(ctx);
    }
    encoder.finish();

    return encoder;
}

module.exports.generate = async function (_text) {
    let image = await _simpleGifText({
        0: {
            text: 'YOU',
            box: {x:394, y:161, w:246, h:84}
        },
        6: {
            text: 'ARE',
            box: {x:0, y:203, w:234, h:84}
        },
        11: {
            text: 'A',
            box: {x:123, y:262, w:399, h:84}
        },
        17: {},
        25: {
            text: _text || 'FAGGOT',
            box: {x:0, y:238, w:640, h:84}
        },
        metadata: {pad: 3, count: 31, filename: './ressources/images/nichijou/%03d.png', w:640, h:360, delay:70, size: 67}
    });
    return image.out.getData();
};