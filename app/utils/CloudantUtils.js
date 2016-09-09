var Promise = require('promise');
var fs = require('fs');

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
      reject(err);
    });
  });

}

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

exports.groupDataFromViewPromise = function(db_request) {

	return new Promise(function(fulfill, reject) {
		try {
			var read_start = new Date();
			var params = { group : true }
			db_request.db_connection.view(db_request.db_design, db_request.db_view , params, function(err, result) {
				var read_end = new Date();
				var elapsed = (read_end.getTime() - read_start.getTime()) / 1000;
				if (err) {
					console.log(new Date().toISOString() + ' Error reading data from DB ' + err);
					reject(err);
				} else {
					console.log(new Date().toISOString() + ' Read ' + result.rows.length + ' docs in ' + elapsed + ' seconds');
					fulfill(result.rows);
				}
			});

		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

exports.readDataFromViewPromise = function(db_request) {

	return new Promise(function(fulfill, reject) {
		try {
			var read_start = new Date();
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
				var read_end = new Date();
				var elapsed = (read_end.getTime() - read_start.getTime()) / 1000;
				if (err) {
					console.log(new Date().toISOString() + ' Error reading data from DB ' + err);
					reject(err);
				} else {
					console.log(new Date().toISOString() + ' Read ' + result.rows.length + ' docs in ' + elapsed + ' seconds');
					fulfill(result);
				}
			});

		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

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

exports.saveBulk = function(db_connection, request) {
	return new Promise(function(fulfill, reject) {
		try {
			var save_start = new Date();
			db_connection.bulk(request, function(err, result) {
				var save_end = new Date();
				var elapsed = (save_end.getTime() - save_start.getTime()) / 1000;
				console.log('Bulk saving of ' + request.docs.length + ' docs took ' + elapsed + ' seconds');
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
