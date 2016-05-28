# anubis

[![Build Status](https://travis-ci.org/m90/anubis.svg?branch=master)](https://travis-ci.org/m90/anubis)

> Make your express application respond correctly when http requests are failing

When your express application is calling failing resources, mount this middleware to ensure it will respond with a `502 Bad Gateway` response when needed.

### Installation

```sh
$ npm install anubis --save
```

### Usage

This is a tiny express app that will do nothing but proxy another resource. In case the call fails with a 5xx error, anubis makes sure the correct `502` status code is returned.

```js
var express = require('express');
var rp = require('request-promise');
var anubis = require('anubis');

var app = express();

app.get('/', function(req, res, next){
	rp('http://my-unreliable-api.com')
		.then(function(payload){
			res.json({ok: true, payload: payload});
		})
		.catch(next);
});

// always make sure to mount anubis **after** all routes that call
// external resources
app.use(anubis);

app.use(function(err, req, res, next){ //eslint-disable-line no-unused-vars
	res.status(err.status);
	res.json({ok: false});
});
```

### License

MIT © [Frederik Ring](http://www.frederikring.com)
