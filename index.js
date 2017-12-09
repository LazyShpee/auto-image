const Jimp = require('jimp');
const express = require('express');
const TinyColor = require('tinycolor2');

var app = express();

const dstatus = require('./libs/dstatus');
const organised_random = require('./libs/organised_random');
const color_mask = require('./libs/color_mask')

app.get('/dstatus/:status', function (req, res) {
  dstatus.generate(function (err, image) {
    if (err) {
      console.log(err);
      return res.status(602).end();
    }
    
    image.getBuffer(Jimp.MIME_PNG, function(err, buffer){
      if (err)
        return res.status(602).end();
      res.set("Content-Type", Jimp.MIME_PNG);
      res.send(buffer);
    });
  }, req.params.status, req.query.pfp);
});

app.get('/awooo', function(req, res) {
  var opt = {
    base: "ressources/awooo_bw_clean.png",
    masks: []
  }

  if (req.query.hair) {
    var color = TinyColor(req.query.hair);
    if (color.isValid()) {
      var rgb = color.toRgb();
      opt.masks.push({
        image: "ressources/awooo_bw_clean_mask_hair.png",
        color: [rgb.r, rgb.g, rgb.b]
      });
    } else
      return res.status(602).end();
  }
  if (req.query.face) {
    var color = TinyColor(req.query.face);
    if (color.isValid()) {
      var rgb = color.toRgb(); 
      opt.masks.push({
        image: "ressources/awooo_bw_clean_mask_face.png",
        color: [rgb.r, rgb.g, rgb.b]
      });
    } else
      return res.status(602).end();
  }

  color_mask.generate(function (err, image) {
    if (err) {
      console.log(err);
      return res.status(602).end();
    }
    
    image.getBuffer(Jimp.MIME_PNG, function(err, buffer){
      if (err)
        return res.status(602).end();
      res.set("Content-Type", Jimp.MIME_PNG);
      res.send(buffer);
    });
  }, opt);
});

var OR = {
  won: {
    base: "ressources/wan_back.png",
    elements: [
      {
        image: "ressources/wan_mouth.png",
        original_position: [399, 610],
        base_position: [399, 610],
        max: 100
      },
      {
        image: "ressources/wan_eye_right.png",
        original_position: [562, 433],
        base_position: [562, 433],
        max: 100
      },
      {
        image: "ressources/wan_eye_left.png",
        original_position: [295, 460],
        base_position: [295, 460],
        max: 100
      }
    ]
  },
  eyes: {
    base: "ressources/eyes_back.png",
    elements: [
      {
        image: "ressources/eyes_pupil.png",
        original_position: [20, 110],
        base_position: [55, 70],
        max: 55,
        scale_y: 1.17
      },
      {
        image: "ressources/eyes_pupil.png",
        original_position: [210, 110],
        base_position: [245, 70],
        max: 55,
        scale_y: 1.17
      }
    ]
  }
};

app.get('/:what', function (req, res) {
  if (!OR[req.params.what])
    return res.status(602).end();
  organised_random.generate(function (err, image) {
    if (err) {
      console.log(err);
      return res.status(602).end();
    }
    
    image.getBuffer(Jimp.MIME_PNG, function(err, buffer){
      if (err)
        return res.status(602).end();
      res.set("Content-Type", Jimp.MIME_PNG);
      res.send(buffer);
    });
  }, OR[req.params.what], req.query.original ? req.query.original === 'true' : false);
});

app.listen(3030, function() {
  console.log('Listening...')
});