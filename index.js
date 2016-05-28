module.exports = function(err, req, res, next){
	err = err || new Error('Internal Server Error');
	var status = err.status || err.statusCode;
	// if there's an internal server error returned from
	// the api we won't propagate that error and
	// return `502 Bad Gateway` instead
	if (status && parseInt(status, 10) > 499){
		err.message = 'Bad Gateway';
		err.status = 502;
		return next(err);
	}
	err.status = status || 500;
	next(err);
};
