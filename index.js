var Q= require('q');
var _= require('lodash');

module.exports= function (settints) {
	return function (req, res, next) {
		// fast pass
		if(settints.exclude && settints.exclude==req.hostname)
			return next();

		appHost(req, res).then(function (hosts) {
			if(!hosts)
				return next();

			if(!hosts.appUrl || exclude(hosts.appUrl))
		      	return next();

		    req.url= '/'+settints.folder+'/'+hosts.appUrl+req.url;
		    next();	
		})
	}


	function exclude (domain) {
		if(!settints.exclude_subdomains)
			return false;

		return (settints.exclude_subdomains.indexOf(domain)>=0);
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