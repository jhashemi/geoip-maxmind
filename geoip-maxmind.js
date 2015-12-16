var http = require('http');
var crypto = require('crypto');
var MMDBReader = require('mmdb-reader');

// Maxmind DB
var reader = new MMDBReader('/usr/local/share/GeoIP/GeoLite2-City.mmdb');

//
http.createServer(function (request, response) {
	
	// Health check
	if (request.url == "/_healthcheck"){
		
	        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8',
        	                        'Cache-Control': 'no-cache, max-age=0',

        	                        });
        	response.end("I'm alive!");
        	console.log("I'm alive!");
	}
	// IP geolocalization
	else if (request.url == "/"){

		// Use other header is behind proxy
		var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
		//var ip = request.headers.ipreq;

		// Lookup IP in Maxmind DB
		iplookup = reader.lookup(ip);

		// If the lookup fails, use fixed IP -- Usually fails when using private IP on local enviroment 	
		if (typeof iplookup == 'undefined' || iplookup == null){
			ip = "69.171.224.1"
			iplookup = reader.lookup(ip);
		};

		// Beautify, please
		country_short = iplookup['country']['iso_code']; 
		country_long = iplookup['country']['names']['es'];
		region = iplookup.subdivisions[0].names['es'];
		city = iplookup['city']['names']['es'];
		latitude = iplookup['location']['latitude'];
		longitude = iplookup['location']['longitude'];

		
		// Map Maxmind DB to IP2LOC standard -- to maintain compatibility with old service
		var json = JSON.stringify({
			ip: ip,
			country_short: country_short, 
			country_long: country_long,
			region: region,
			city: city,
			latitude: latitude,
			longitude: longitude,
		});		

		// Response
		response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8',
					'Cache-Control': 'max-age=14400',
					'ETag': crypto.createHash('md5').update(json).digest("hex"),

					});
		response.end(json);
		
		//
		console.log(json);
	}
	else {
	        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8',
        	                        'Cache-Control': 'max-age=60',
        	                        });
        	response.end("Unrecognized");
	}

}).listen(8080);

console.log('Server started');

