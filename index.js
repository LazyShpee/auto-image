const express = require('express');
const app = express();

let search = require('./generators/search');

app.get('/search', async (req, res) => {
    let file = await search.generate(req.query.text || "I forgot to give some text...");

    res.set('Content-Type', 'image/png');
    return res.status(200).send(file);
});

app.listen(3030, () => {
    console.log('Listening on 3030...');
});