vcl 4.0;

backend default {
    .host = "127.0.0.1";
    .port = "8080";
}

#acl ip_allowed
#{
#        "localhost";
#	"127.0.0.0"/8;
#        "10.0.0.0"/8;
#        "172.16.0.0"/12;
#	"192.168.0.0"/16;
#}

sub vcl_recv {
	
	#if ( 
	#	client.ip !~ ip_allowed &&
	#	req.http.referer !~ "example.com" 
	# )
	#{
	#	return(synth(403, "Forbidden"));
	#}


	set req.http.ipreq = client.ip;
	return(hash);

}

sub vcl_hash {
	hash_data(client.ip);
}

sub vcl_backend_response {
   
	set beresp.http.X-Cacheable-TTL = beresp.ttl;

	unset beresp.http.Vary;

	set beresp.http.Access-Control-Allow-Origin =  "*";
	
	set beresp.grace = 12h;


}

sub vcl_deliver {

	if (obj.hits > 0)
	{
		set resp.http.X-Cache = "HIT (" + obj.hits + ")";
	}
	else
	{
		set resp.http.X-Cache = "MISS";
	}

}
