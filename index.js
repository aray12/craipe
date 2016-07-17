#!/usr/bin/env node

const argv = require('yargs')
	.usage('Usage $0 --term [string] --file [filepath]')
	.demand(['term', 'file'])
	.argv;

const path = require('path');
const request = require('superagent');
const cheerio = require('cheerio');

const URLS = require('fs').readFileSync(path.resolve(process.cwd(), argv.file)).toString().split("\n");


function match(term, text) {
	//return true;
	const REGEX = new RegExp(term, 'i');
	return REGEX.test(text);
}

function search(term) {
	URLS.forEach(site => {
		request.get(site).end((err, res) => {
			if (err) throw new Error(err);

			const $ = cheerio.load(res.text);

			const text = $('div, span, p, article, li, dd, h1, h2, h3, h4, h5, h6').text();

			if (match(term, text)) {
				console.log(site);
			}
		});
	});
}

search(argv.term);

