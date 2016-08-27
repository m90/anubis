var request = require('supertest');
var assert = require('assert');
var nock = require('nock');
var _ = require('underscore');
var app = require('./fixtures/app');
var anubis = require('./../index');

describe('anubis', function(){

	var scope = nock('http://my-api.foo');

	it('exports a function that returns a function when passing a function', function(){
		assert(_.isFunction(anubis));
		assert(_.isFunction(anubis(Function.prototype)));
	});
	it('expects `err, req, res, next` signature', function(){
		assert.equal(anubis(Function.prototype).length, 4);
	});
	it('does not interfere with successful requests', function(done){
		scope
			.get('/resource')
			.reply(200, {i: 'love you'});
		request(app)
			.get('/')
			.expect(200)
			.expect(/true/)
			.end(done);
	});
	describe('correctly propagates 4xx responses', function(){
		it('correctly propagates 400 responses', function(done){
			scope
				.get('/resource')
				.reply(400, {i: 'think you sent wrong things'});
			request(app)
				.get('/')
				.expect(400)
				.expect(/false/)
				.end(done);
		});
		it('correctly propagates 401 responses', function(done){
			scope
				.get('/resource')
				.reply(401, {i: 'dont like you too much'});
			request(app)
				.get('/')
				.expect(401)
				.expect(/false/)
				.end(done);
		});
		it('correctly propagates 403 responses', function(done){
			scope
				.get('/resource')
				.reply(403, {i: 'dont grant access'});
			request(app)
				.get('/')
				.expect(403)
				.expect(/false/)
				.end(done);
		});
	});
	describe('correctly handles 5xx responses', function(){
		it('correctly handles 500 responses', function(done){
			scope
				.get('/resource')
				.reply(500, {i: 'broke badly'});
			request(app)
				.get('/')
				.expect(502)
				.expect(/false/)
				.end(done);
		});
		it('correctly handles 502 responses', function(done){
			scope
				.get('/resource')
				.reply(502, {i: 'have the same problem as you'});
			request(app)
				.get('/')
				.expect(502)
				.expect(/false/)
				.end(done);
		});
		it('correctly handles 504 responses', function(done){
			scope
				.get('/resource')
				.reply(504, {i: 'am asleep'});
			request(app)
				.get('/')
				.expect(502)
				.expect(/false/)
				.end(done);
		});
	});
});
