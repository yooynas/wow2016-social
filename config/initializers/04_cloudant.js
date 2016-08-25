// Load the Cloudant library.
var Cloudant = require('cloudant');

module.exports = function() {

	// Get the credentials from the VCAP file sitting in the environment
	//var cloudant_credentials = global.appEnv.getServiceCreds('Cloudant NoSQL DB-zk');
	//
	// var user = cloudant_credentials.username;
	// var password = cloudant_credentials.password;
	//
	// // Initialize the library with my account.
	// var cloudant = Cloudant({account:user, password:password});

	function checkDB(db_name, callback) {
		cloudant.db.get(db_name, function(err, body) {

			if (err) {
				console.log('Database ' + db_name + ' not found, trying to create it...')
	  			cloudant.db.create(db_name, function() {
	  				console.log('Database ' + db_name + ' successfully created....');
	  				global[db_name + 'DB'] = cloudant.db.use(db_name);
	  				callback();
	  			});
			} else {
				console.log('Found ' + body.db_name + ' DB with ' + body.doc_count + ' documents');
				global[db_name + 'DB'] = cloudant.db.use(db_name);
				callback();
			}
		});

	}

}
