module.exports= function (settints) {
	return function (req, res, next) {
		if(!appHost(req.hostname)) // if request hostname is not settings hostname
			return next();

		if(req.subdomains.length==0 || exclude(req.subdomains[0]))
	      	return next();

	    	req.url= '/'+settints.folder+'/'+req.subdomains[0]+req.url;
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

		var hosts= hostname.split('.');
		var domain= lastTwo(hosts);
		return (domain==settints.hostname);
	}

	function lastTwo (arr) {
		if(arr.length==0)
			return null;
		else if(arr.length<2)
			return arr[0];
		else
			return arr[arr.length-2] + '.' + arr[arr.length-1]
	}
}