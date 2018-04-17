const Jimp = require('jimp');
const helper = require('../helper');

// 158 x 64

async function _search(_text) {
    const tw = 172, th = 74, tx = 54, ty = 328;

    let font = await Jimp.loadFont('./ressources/fonts/DILBERT.fnt');
    let base = await Jimp.read('./ressources/images/the-search.png');
    let text = await new Jimp(tw, th);

    text.print(font, 3, 0, _text, tw - 8).crop(0 ,0 , tw - 2, th - 2).autocrop();

    base.composite(text, tx + (tw - text.bitmap.width) / 2, ty + (th - text.bitmap.height) / 2);

    return base;
}

module.exports.generate = async function (text) {
    let image = await _search(text);
    return helper.getBuffer(image, Jimp.MIME_PNG);
};