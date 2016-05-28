var express = require('express');
var anubis = require('./../../index');
var rp = require('request-promise');

var app = express();

app.get('/', function(req, res, next){
	rp('http://my-api.foo/resource')
		.then(function(){
			res.json({ok: true});
		})
		.catch(next);
});

app.use(anubis);

app.use(function(err, req, res, next){ //eslint-disable-line no-unused-vars
	res.status(err.status);
	res.json({ok: false});
});

module.exports = app;
