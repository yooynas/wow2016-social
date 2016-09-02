var cloudant = require('cloudant');
var Promise = require('promise');
var fs = require('fs');

module.exports.checkDB = function(cloudant, db_name) {

  return new Promise(function(fulfill, reject) {
    cloudant.db.get(db_name, function(err, body) {
			if (err) {
				console.log('Database ' + db_name + ' not found, trying to create it...')
  			cloudant.db.create(db_name, function() {
  				console.log('Database ' + db_name + ' successfully created....');
  				fulfill(cloudant.db.use(db_name));
  			});
			} else {
				console.log('Found ' + body.db_name + ' DB with ' + body.doc_count + ' documents');
				fulfill(cloudant.db.use(db_name));
			}
		});
  });

}

// Function to check for a design document and create it if it doesn't exist
module.exports.checkDesignDoc = function(db_connection, design_name, design_def) {
  return new Promise(function(fulfill, reject) {
    var design_doc_selector = { "selector" : { "_id" : "_design/" + design_name } };
    db_connection.find(design_doc_selector, function(err, result) {
      var design_docs = result.docs;
      var design_names = [];
      design_docs.forEach(function(design) {
        design_names.push(design._id);
      });
      if (design_names.indexOf("_design/" + design_name) == -1) {
        var design_json = JSON.parse(fs.readFileSync(design_def, 'utf8'));
        console.log('Loading the design document ' + design_name + ' into the cloudant instance...');
        // db_connection.insert(design_json, function(err, result) {
        //   console.log('Created a new Design Doc : ' + JSON.stringify(result));
        //   reject(err);
        // });
      } else {
        console.log('Design document ' + design_name + ' exist...');
        fulfill();
      }
    });
  });

}
