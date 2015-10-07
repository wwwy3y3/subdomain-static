var Q= require('q');
var _= require('lodash');
var s3fs= require('./s3fs');
var path= require('path');

/*
 get domain, subdomains, and hostname
*/
module.exports= function (settints) {
	return function (req, res, next) {
		//  test if exclude pattern fit the hostname
		if(settints.exclude_hostname 
			&& settints.exclude_hostname.test(req.hostname))
			return next();

		// fast pass, by looking at excluse domain
		var hostname= req.hostname;
		var subdomains= req.subdomains;
		var domain= hostname.split('.').slice(subdomains.length).join('.');

		// if exclude equals to domain, next
		if(settints.exclude_domain && settints.exclude_domain==domain)
			return next();

		// get appUrl
		var regex= new RegExp('^[\\w\\-]+(?=\\.'+settints.hostname.replace('.','\\.')+'$)', 'i');
		var hosts= regex.exec(hostname);

		// if hostname is settings.hostname, it's a app request
		// so get appUrl by gettings the subdomain
		if(hosts){
			return locate(settints, hosts[0], req.url);
		}else{
			// if it's apphost with no appUrl
			if(settints.hostname==domain)
				return next();

			// who is this unknown hostname?
			if(!settints.cnameLookup)
				return next();

			// hey! it's me! lookup in your db
			return Q.when(settints.cnameLookup(hostname, req, res))
			.then(function (url) {
				return locate(settints, url, app.url);
			});
		}

		function locate (settints, appUrl, _path) {
			// search in local fs
			if(settints.folder){
				req.url= '/'+settints.folder+'/'+appUrl+_path;
				return next();
			}else if(settints.s3Bucket){
				if(_path=='/' || !_path)
					_path= '/index.html'
				var key= path.join(appUrl, _path);
				var s3stream= s3fs.createReadStream(settints.s3Bucket, key);
				s3stream.on('error', function (err) {
					if(err.code && err.code=='NoSuchKey'){
						var nextErr= new Error('NoSuchKey');
						nextErr.status= 404;
						return next(nextErr);
					}else{
						next(err);
					}
				})
				return s3stream.pipe(res);
			}
		}
	}
}


