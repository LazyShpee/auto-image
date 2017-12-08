const Jimp = require('jimp');

// """"Config""""
const side = 128;
const center = side / 2 - 1;
const circlex = 110.5;
const circley = 110.5;
const circler = 11.5;
const circleo = 15.5;
const radius = center;

const stats = {
  streaming: [89, 54, 149],
  dnd: [240, 71, 71],
  online: [67, 181, 129],
  offline: [116, 127, 141],
  idle: [250, 166, 26]
}

function dist(x, y, cx, cy) {
  var a = x - cx;
  var b = y - cy;

  return Math.sqrt(a*a + b*b);
}

/*
  string status, discord status name
  string img, image url/path
*/

exports.generate = function (callback, status, img) {
  Jimp.read(img, function (err, image) {
    if (err)
      return callback(err);
      
    try {
      image.cover(side, side, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)

      .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        var main = dist(x, y, center, center);
        var circle = dist(x, y, circlex, circley);
        
        if (circle < circleo) {
          this.bitmap.data[ idx + 3 ] = circle > circler ? 0 : 255;
          if (circle <= circler) {
            this.bitmap.data[ idx + 0 ] = stats[status][0];
            this.bitmap.data[ idx + 1 ] = stats[status][1];
            this.bitmap.data[ idx + 2 ] = stats[status][2];
          }
        } else if (main >= radius) {
          this.bitmap.data[ idx + 3 ] = main > radius ? 0 : 100;
        }
      })
      
      return callback(null, image);
      
    } catch (e) {
      return callback(e);
    }
  });
}