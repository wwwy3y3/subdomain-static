module.exports= function (folder) {
	return function (req, res, next) {
		if(req.subdomains.length==0)
	      	return next();

	    	req.url= '/'+folder+'/'+req.subdomains[0]+req.url;
	    	next();
		}
}