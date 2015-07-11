var Q= require('q');
var _= require('lodash');

/*
 get domain, subdomains, and hostname

 testing
 app1.test.canner.io
 subdomain: test, app1
 hostname: app1.test.canner.io
 domain: canner.io

 prod:
 app1.cannerapp.com
 subdomain: app1
 hostname: app1.cannerapp.com
 domain: cannerapp.com

 local:
 app1.localapp.host
 subdomain: app1 
 hostname: app1.localapp.host
 domain: localapp.host

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
		}

		// not from appHost, from a unknown host
		// check in db, if settings.cnameLookup exist
		appHost(req, res).then(function (hosts) {
			if(!hosts)
				return next();


		    req.url= '/'+settints.folder+'/'+hosts.appUrl+req.url;
		    next();	
		}).catch(next);
	}

	function appHost (req, res) {
		var hostname= req.hostname;
		if(!settints.hostname)
			return true;

		var length= settints.hostname.split('.').length;
		var hosts= hostname.split('.');
		var appUrl= (hosts.length>length)?hosts[0]:null;
		var domain= getHost(hosts, length);
		if(domain!==settints.hostname){
			// unknown domain, who r u?
			if(!settints.cnameLookup)
				return Q(false);
			else  // hey! it's me! lookup in your db
				return Q.when(settints.cnameLookup(domain, req, res)).then(function (url) {
					return { appUrl: url };
				});
		}else{
			// yeah, same hostname, you go!
			return Q({ appUrl: appUrl, domain: domain });
		}
	}
}

var getHost= exports.getHost= function (hosts, length) {
	if(hosts.length==0)
		return null;
	else if(hosts.length<2)
		return hosts[0];
	else
		return hosts.slice(hosts.length-length).join('.');
}