module.exports= function (settints) {
	return function (req, res, next) {

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
}