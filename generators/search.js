const Jimp = require('jimp');
const helper = require('../helper');

// 158 x 64

async function _search(_text) {
    let font = await Jimp.loadFont('./ressources/fonts/DILBERT.fnt');
    let base = await Jimp.read('./ressources/images/the-search.png');
    let text = await new Jimp(158, 74);

    text.print(font, 3, 0, _text, 154).crop(0,0,158,73);

    base.composite(text, 60, 330);

    return base;
}

module.exports.generate = async function (text) {
    let image = await _search(text);
    return helper.getBuffer(image, Jimp.MIME_PNG);
};