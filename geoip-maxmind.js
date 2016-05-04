r http = require('http');
var crypto = require('crypto');
var MMDBReader = require('mmdb-reader');

// Language selection - "en", "es", etc.
language = "en"; 

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

		// Iso Code
		if (typeof iplookup['country']['iso_code'] == 'undefined' || iplookup['country']['iso_code'] == null){
                        country_short = null;
                } else {
                        country_short = iplookup['country']['iso_code'];
                };
		
		// Country name
		if (typeof iplookup['country']['names'][language] == 'undefined' || iplookup['country']['names'][language] == null){
			country_long = null;
		} else {
			country_long = iplookup['country']['names'][language];	
		};

		// Region
		if (typeof iplookup.subdivisions == 'undefined' || iplookup.subdivisions == null){
			region = null;
		} else {
			region = region = iplookup.subdivisions[0].names[language];
		};

		// City
		if (typeof iplookup['city'] == 'undefined' || iplookup['city'] == null ){
			 city = null;
		} else {
			city = iplookup['city']['names'][language];
		};

		// Latitude
		if (typeof iplookup['location']['latitude'] == 'undefined' || iplookup['location']['latitude'] == null){
			latitude = null;
		} else {
			latitude = iplookup['location']['latitude'];
		};

		// Longitude
		if (typeof iplookup['location']['longitude'] == undefined || iplookup['location']['longitude'] == null){
			longitude = null;
		} else {
			longitude = iplookup['location']['longitude'];
		};

		
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
