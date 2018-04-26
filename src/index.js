'use strict';

const express = require('express');
const app = express();

const awooo = require('./generators/awooo');
const simpleTemplate = require('./generators/simple-template');
const templates = require('../resources/simple-template/templates');

app.get('/awooo', async (req, res) => {
	awooo(req.query, res);
});

app.get('/:type', async (req, res, next) => {
	const type = req.params.type ? req.params.type.replace(/_([a-z])/, (_, group) => group.toUpperCase()) : null;
	if (templates[type]) {
		req.query.type = type;
		simpleTemplate(req.query, res);
	} else {
		next();
	}
});

app.listen(3030, () => {
	console.log('Listening on 3030...');
});
