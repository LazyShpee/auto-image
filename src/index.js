const express = require('express');
const app = express();
const tinycolor = require('tinycolor2');

let awooo = require('./generators/awooo');

app.get('/awooo', async (req, res) => {
	awooo(req.query, res);
});

app.listen(3030, () => {
	console.log('Listening on 3030...');
});