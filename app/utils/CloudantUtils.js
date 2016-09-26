var Promise = require('promise');
var fs = require('fs');

// Function to find the session info from the wow-session-info db.
// The index session_id_idx is required.
exports.findSessionInfo = function(session_id) {
  var ctrl = this;
  var session_info = global['wow-session-infoDB'];

  return new Promise(function(fulfill, reject) {
    var db_request = {
      db_connection : session_info,
      db_design : 'wow-session-info',
      db_view : 'session_id_idx',
      query : { q: 'session_id:' + session_id, include_docs : true }
    };

    ctrl.findDocByQueryIndex(db_request).then(function(data) {
      fulfill(data.rows[0].doc);
    }, function(err) {
      console.log(err);
      reject(err);
    });
  });

}

// Function that will find a document in Cloudant based on a Query index
exports.findDocByQueryIndex = function(db_request) {
  return new Promise(function(fulfill, reject) {
		try {
      db_request.db_connection.search(db_request.db_design, db_request.db_view, db_request.query, function(err, result) {
        if (err) {
          reject(err);
        } else {
          fulfill(result);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

// Function that will return a grouped view result
exports.groupDataFromViewPromise = function(db_request) {

	return new Promise(function(fulfill, reject) {
		try {
			var params = { group : true }
			db_request.db_connection.view(db_request.db_design, db_request.db_view , params, function(err, result) {
				if (err) {
					console.log(new Date().toISOString() + ' Error reading data from DB ' + err);
					reject(err);
				} else {
					fulfill(result.rows);
				}
			});

		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

// Function that reads the documents from a Cloudant View
exports.readDataFromViewPromise = function(db_request) {

	return new Promise(function(fulfill, reject) {
		try {
			var params = { reduce: false, limit: db_request.limit, skip: db_request.skip, descending: false, include_docs : db_request.include_docs };
			if (db_request.start_key) {
				params.startkey = db_request.start_key;
			}
			if (db_request.end_key) {
				params.endkey = db_request.end_key;
			}
			if (db_request.start_key) {
				if (!db_request.end_key) {
					params.key = db_request.start_key;
				}
			}
			db_request.db_connection.view(db_request.db_design, db_request.db_view , params, function(err, result) {
				if (err) {
					console.log(new Date().toISOString() + ' Error reading data from DB ' + err);
					reject(err);
				} else {
					fulfill(result);
				}
			});

		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

// Function that will save a bulk request to Cloudant
exports.saveBulk = function(db_connection, request) {
	return new Promise(function(fulfill, reject) {
		try {
			db_connection.bulk(request, function(err, result) {
				if (err) {
					reject(err);
				} else {
					fulfill(result);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
}

// Function that Checks whether a Cloudant database exist and create it if it doesn't
exports.checkDB = function(cloudant, db_name) {

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
exports.checkDesignDoc = function(db_connection, design_name, design_def) {
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
        db_connection.insert(design_json, function(err, result) {
           console.log('Created a new Design Doc : ' + JSON.stringify(result));
           fulfill();
        });
      } else {
        console.log('Design document ' + design_name + ' exist...');
        fulfill();
      }
    });
  });

}
