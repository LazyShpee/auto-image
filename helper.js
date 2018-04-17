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

module.exports = {getRandomArbitrary, def, getBuffer, distance};