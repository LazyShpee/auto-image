'use strict';

const tinycolor = require('tinycolor2');

const colorize = require('../functions/colorize');
const canvasify = require('../functions/canvasify');

async function awooo(query, res) {
	const hair = query.hair ? tinycolor(query.hair) : null;
	const face = query.face ? tinycolor(query.face) : null;
	const mode = colorize.Modes.includes(query.mode) ? query.mode : 'hsl-color';

	const canvas = await canvasify('resources/awooo/base.png');

	try {
		await colorize({
			on: canvas,
			source: 'resources/awooo/hair.png',
			color: hair,
			mode,
		});

		await colorize({
			on: canvas,
			source: 'resources/awooo/face.png',
			color: face,
			mode,
		});
	} catch (e) {
		res.set('Content-Type', 'text/plain').status(400).end(e.message);
		return
	}

	res.set('Content-Type', 'image/png');
	return canvas.pngStream().pipe(res.status(200));
}

module.exports = awooo;
