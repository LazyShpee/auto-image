const express = require('express');
const app = express();
const tinycolor = require('tinycolor2');

let search = require('./generators/search');
let colorize = require('./generators/colorize');
let nichijou = require('./generators/nichijou');
let compose = require('./generators/compose');

const templates = require('./ressources/data/compose_templates');
app.get('/:type', async (req, res, next) => {
    if (!templates[req.params.type]) return next(); // If template type not found, let other router do the thing

    let file = await compose.generate(templates[req.params.type], req.query.text, req.query.image, req.query.mode);

    res.set('Content-Type', 'image/png');
    return res.status(200).send(file);
});

app.get('/awooo', async (req, res) => {
    let color = tinycolor(req.query.color || 'red');
   let file = await colorize.generate([
        {path: './ressources/images/awooo_regular.png'},
        {path: './ressources/images/awooo_regular_hair.png', color: color, mode: req.query.mode}
    ]);

    res.set('Content-Type', 'image/png');
    return res.status(200).send(file);
});

app.get('/nichijou', async (req, res) => {
    let file = await nichijou.generate(req.query.text);

    res.set('Content-Type', 'image/gif');
    return res.status(200).send(file);
});

app.listen(3030, () => {
    console.log('Listening on 3030...');
});