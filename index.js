module.exports= function (settints) {
	return function (req, res, next) {
		var hosts= appHost(req.hostname);
		if(!hosts) // if request hostname is not settings hostname
			return next();

		if(!hosts.appUrl || exclude(hosts.appUrl))
	      	return next();

	    req.url= '/'+settints.folder+'/'+hosts.appUrl+req.url;
	    next();
	}


	function exclude (domain) {
		if(!settints.exclude_subdomains)
			return false;

		return (settints.exclude_subdomains.indexOf(domain)>=0);
	}

	function appHost (hostname) {
		if(!settints.hostname)
			return true;

		var length= settints.hostname.split('.').length;
		var hosts= hostname.split('.');
		var appUrl= (hosts.length>length)?hosts[0]:null;
		var domain= getHost(hosts, length);
		if(domain!==settints.hostname)
			return false;
		else
			return { appUrl: appUrl, domain: domain };
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