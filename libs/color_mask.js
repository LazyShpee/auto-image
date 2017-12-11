const Jimp = require('jimp')

/*
  {
    base: 'path',
    masks: [
      {
        image: 'path',
        color: [r, g, b]
      }
    ]
  }
*/

function _colorize(image, options, index, callback) {
  if (index < options.masks.length) {
    Jimp.read(options.masks[index].image).then(function(mask) {
      if (image.bitmap.width !== mask.bitmap.width || image.bitmap.height !== mask.bitmap.height) {
        return callback('Error coloring mask ' + index + ', mask and base image size should match');
      }
      for (var i = 0; i < image.bitmap.width * image.bitmap.height * 4; i += 4) {
        if (mask.bitmap.data[i] === 255 && mask.bitmap.data[i + 1] === 255 && mask.bitmap.data[i + 2] === 255) {
          for (var n = 0; n < 3; n++)
            image.bitmap.data[i + n] = options.masks[index].color[n];
        }
      }
      _colorize(image, options, index + 1, callback);
    }).catch(function(err) {
      callback(err);
    });
  } else {
    callback(null, image);
  }
}

exports.generate = function(callback, options) {
  Jimp.read(options.base)
  .then(function(image) {
    _colorize(image, options, 0, callback);
  })
  .catch(function(err) {
    callback(err);
  });
}