/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
var locomotive = require('locomotive');
var Promise = require('promise');
var Request = require('request');
var cloudant = require('cloudant');

var Controller = locomotive.Controller;
var apiController = new Controller();

var my_nodered_endpoint = "";

apiController.webConversation = function() {
    var that = this;
    var text = this.req.body.text;
    var user_id = this.req.user.profile.username;

    if (!text) {
      that.res.send(500).json({ "error" : "Text message is required."});
      return;
    }

    callNodeRedWebConversation(text, user_id).then(function(response) {
      var intent = response.intents[0].intent;
      var entity = response.entities[0];

      console.log(intent + ' ' + JSON.stringify(entity));

      if (intent && entity) {
        findSessionInfo(entity.value).then(function(session_info) {
          console.log(session_info);
          if (intent === 'WHAT') {
            that.res.status(200).json(session_info.Title);
          }
          if (intent === 'WHERE') {
            that.res.status(200).json('Room ' + session_info.Room);
          }
          if (intent === 'WHEN') {
            that.res.status(200).json(session_info.Day + ' in the ' + session_info.Time);
          }
        });
      } else {
        that.res.status(200).send('I\m sorry, but the information you provided wasn\'t found in the system');
      }
    }, function(err) {
      console.log('ERROR: ' + err);
      that.res.send(200).json(err);
    });
}

apiController.socialData = function() {
  var that = this;
  // Get the paging params from the request
  var limit = this.req.query.limit;
  var skip = this.req.query.offset;

  var incoming = global['wow-incomingDB'];

  var db_request = {
    db_connection : incoming,
    db_design : 'wow-incoming',
    db_view : 'created-at-view',
    limit : limit,
    skip : skip,
    include_docs : true
  };

  readDataFromViewPromise(db_request).then(function(data) {
    console.log(data);

    var response = {
      total : data.total_rows,
      rows : []
    }

    for (var i=0; i<data.rows.length; i++) {
      var item = data.rows[i];
      response.rows.push(item.doc);
    }

    that.res.status(200).json(response);
  }, function(err) {
    that.res.status(500).json(err);
  });

}

apiController.sentiment = function() {
  var that = this;
  var incoming = global['wow-incomingDB'];
  var db_request = {
    db_connection : incoming,
    db_design : 'wow-incoming',
    db_view : 'sentiment-view'
  };

  groupDataFromViewPromise(db_request).then(function(data) {
    var response = {
      keys : [],
      values : []
    }
    data.forEach(function(set) {
      response.keys.push(set.key);
      response.values.push(set.value);
    });
    that.res.status(200).send(response);
  }, function(err) {
    that.res.status(500).json(err);
  });
}

apiController.emotionalTone = function() {
  var that = this;
  var incoming = global['wow-incomingDB'];
  var db_request = {
    db_connection : incoming,
    db_design : 'wow-incoming',
    db_view : 'emotional-tone-view'
  };

  groupDataFromViewPromise(db_request).then(function(data) {
    var response = {
      keys : [],
      values : []
    }
    data.forEach(function(set) {
      response.keys.push(set.key);
      response.values.push(set.value);
    });
    that.res.status(200).send(response);
  }, function(err) {
    that.res.status(500).json(err);
  });
}

apiController.emotionalToneOverTime = function() {
  var that = this;
  var incoming = global['wow-incomingDB'];
  var db_request = {
    db_connection : incoming,
    db_design : 'wow-incoming',
    db_view : 'emotional-tone-overtime-view'
  };
  groupDataFromViewPromise(db_request).then(function(data) {
    try {
      var rows = data;
      var response = {};
      var dates = [];
      for (var i=0; i<rows.length; i++) {
        var date_str = rows[i].key[2] + '/' + (Number(rows[i].key[1]) + 1);
        if (dates.indexOf(date_str) < 0) {
          dates.unshift(date_str);
        }
        var tone = rows[i].key[3];
        if (!response[tone]) {
          var val = {
            data : [rows[i].value]
          }
          response[tone] = val;
        } else {
          response[tone].data.unshift(rows[i].value);
        }
      }
      response.labels = dates;
      that.res.status(200).json(response);
    } catch (err) {
      that.res.send(err);
    }
  }, function(err) {
    that.res.status(500).json(err);
  });
}

apiController.deleteIncoming = function() {
    var that = this;
    var _id = this.req.query._id;
    var _rev = this.req.query._rev;

    var incoming = global['wow-incomingDB'];

    incoming.destroy(_id, _rev, function(err, result) {
      console.log(err);
      console.log(result);
      if (err) {
        that.res.status(500).send(err);
      } else {
        that.res.status(200).send(result);
      }
    });
}

function findSessionInfo(session_id) {
  var session_info = global['wow-session-infoDB'];

  return new Promise(function(fulfill, reject) {
    var db_request = {
      db_connection : session_info,
      db_design : 'wow-session-info',
      db_view : 'session_id_idx',
      query : { q: 'session_id:' + session_id, include_docs : true }
    };

    findDocByQueryIndex(db_request).then(function(data) {
      fulfill(data.rows[0].doc);
    }, function(err) {
      reject(err);
    });
  });

}

function findDocByQueryIndex(db_request) {
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

function groupDataFromViewPromise(db_request) {

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

function readDataFromViewPromise(db_request) {

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

function callNodeRedWebConversation(text, user_id) {
  var nr_url = global.app_params['node-red-instance-url'];
  return new Promise(function(fulfill, reject) {
		try {
      var url = nr_url + '/web/conversation';
      var data = {
        text: text,
        user_id : user_id
      };
			Request(
				{
			    	uri: url,
            qs : data,
            method: "POST"
			  },
				function (err, response, body) {
					if (err) {
						reject({ "error" : err })
					} else {
						if (response.statusCode == 200) {
							var result = JSON.parse(body);
              console.log(result);
							fulfill(result);
						} else {
							var err = {"error" : 'HTTP Status code : ' + response.statusCode };
							reject(err);
						}
	  			}
				}
			);

		} catch (err) {
			console.log(err);
			reject({ "error" : err });
		}
	});
}

apiController.before('*', function(next) {
	if(!this.req.isAuthenticated()){
    	this.redirect('/login');
  	} else {
      console.log('Session Expires in ' + this.req.session.cookie.maxAge / 1000 / 60 + ' minutes');
  		next();
  	}
});

module.exports = apiController;
