const Jimp = require('jimp');
const express = require('express');
var app = express();

const dstatus = require('./libs/dstatus');
const organised_randon = require('./libs/organised_random');

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

var WON = {
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
};

app.get('/won', function (req, res) {
  organised_randon.generate(function (err, image) {
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
  }, WON);
});

app.listen(3030, function() {
  console.log('Listening...')
});