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

/**
 * @description Returns all matches of re on sourceString
 * @param {sourceString} string Thy string
 * @param {re} RegExp Thy regexp
 */
function findAll(sourceString, re, aggregator = []) {
    const arr = re.exec(sourceString);

    if (arr === null) return aggregator;

    const newString = sourceString.slice(arr.index + arr[0].length);
    return findAll(newString, re, aggregator.concat([arr]));
}

module.exports = {getRandomArbitrary, def, getBuffer, distance, findAll};