const Jimp = require('jimp');

/*

{
  base: 'path',
  elements: [
    {
      image: 'path',
      original_position: [x, y],
      base_position: [x, y],
      min: 0,
      max: 100,
    }
  ]
}

*/

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function _compose(image, options, index, callback, original) {
  if (index < options.elements.length) {
    Jimp.read(options.elements[index].image)
    .then(function (img) {
      var e = options.elements[index];
      var x = 0, y = 0
      
      if (!original) {
        var angle = getRandomArbitrary(0, Math.PI * 2);
        x += getRandomArbitrary(e.min ? e.min : 0, e.max);

        var xp = x;
        var yp = y;
        x = xp * Math.cos(angle) - yp * Math.sin(angle) + e.base_position[0];
        y = yp * Math.cos(angle) + xp * Math.sin(angle) + e.base_position[1];
      } else {
        x += e.original_position[0];
        y += e.original_position[1];
      }

      image.composite(img, x, y)
      _compose(image, options, index + 1, callback, original);
    })
    .catch(function(err) {
      callback(err);
    });
  } else {
    callback(null, image);
  }
}

exports.generate = function (callback, options, original) {
  var elems = []
  
  Jimp.read(options.base)
  .then(function(image) {
    _compose(image, options, 0, callback, original);
  })
  .catch(function(err) {
    callback(err);
  });
}