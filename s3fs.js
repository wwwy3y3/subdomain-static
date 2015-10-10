var Promise= require('bluebird');
var AWS = require('aws-sdk'); 
var S3= new AWS.S3({ sslEnabled: false });
exports.read= function (bucket, key) {
	var getObjectAsync= Promise.promisify(S3.getObject, S3);
	return getObjectAsync({ Bucket: bucket, Key: key })
	.get("Body")
	.call('toString', 'utf8');
}

exports.createReadStream= function (bucket, key) {
	return S3.getObject({ Bucket: bucket, Key: key }).createReadStream();
}

exports.write= function (data, bucket, key) {
	var params = {
		Bucket: bucket, 
		Key: key, Body: data, 
		ACL: "public-read", 
		ContentType: 'text/html'
	};
	var uploadAsync= Promise.promisify(S3.upload, S3);
	return uploadAsync(params);
}