
const http = require('http');
const fs = require('fs');

http.createServer(function(request, response) {
	var headers = request.headers;
	var method = request.method;
	var url = request.url;
	var body = [];
	console.log('url:');
	console.log(url);
	console.log('hash:');
	console.log(request.hash);
	if (url.indexOf('action') === 0) {
		let r = {
			success : true,
			data : {
				adminId : 69,
				session : '111'
			},
			message : 'successful'
		}
		response.write(JSON.stringify(r));
		response.end();
		return;
	}
	let url_s = url.toString();
	if (url_s === '' || url_s === '/') {
		url_s = '/index.html';
	}
	if (fs.existsSync('.' + url_s)) {
		fs.readFile('.' + url_s, (err, data) => {
			if (err) throw err;
			//response.write(data);
			//response.setHeader('Content-Type', 'text/html; charset=utf-8');
			response.end(data);
			console.log(data);
			return;
		});
		return;
	}
	request.on('error', function(err) {
		console.error(err);
	}).on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function() {
		body = Buffer.concat(body).toString();
	// BEGINNING OF NEW STUFF

		response.on('error', function(err) {
		console.error(err);
	});

	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
	// Note: the 2 lines above could be replaced with this next one:
	// response.writeHead(200, {'Content-Type': 'application/json'})

	var responseBody = {
		headers: headers,
		method: method,
		url: url,
		body: body
	};

	response.write(JSON.stringify(responseBody));
	response.end();
	// Note: the 2 lines above could be replaced with this next one:
	// response.end(JSON.stringify(responseBody))

	// END OF NEW STUFF
	});
}).listen(10002);

