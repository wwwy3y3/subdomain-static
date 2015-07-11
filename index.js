var Q= require('q');
var _= require('lodash');

/*
 get domain, subdomains, and hostname
*/
module.exports= function (settints) {
	return function (req, res, next) {
		// fast pass, by looking at excluse domain
		var hostname= req.hostname;
		var subdomains= req.subdomains;
		var domain= hostname.split('.').slice(subdomains.length).join('.');

		// if exclude equals to domain, next
		if(settints.exclude && settints.exclude==domain)
			return next();

		// get appUrl
		var regex= new RegExp('^[\\w\\-]+(?=\\.'+settints.hostname.replace('.','\\.')+'$)', 'i');
		var hosts= regex.exec(hostname);

		// if hostname is settings.hostname, it's a app request
		// so get appUrl by gettings the subdomain
		if(hosts){
			req.url= '/'+settints.folder+'/'+hosts[0]+req.url;
			return next();
		}else{
			// if it's apphost with no appUrl
			if(settints.hostname==domain)
				return next();

			// who is this unknown hostname?
			if(!settints.cnameLookup)
				return next();

			// hey! it's me! lookup in your db
			return Q.when(settints.cnameLookup(hostname, req, res)).then(function (url) {
				req.url= '/'+settints.folder+'/'+url+req.url;
				next();
			});
		}
	}
}
