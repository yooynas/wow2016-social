var Promise = require('promise');
var Request = require('request');

// Function to call node-red conversation end-point.
// Require the node-red-instance-url to be set to a valid URL.
module.exports.callNodeRedWebConversation = function(text, user_id) {

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
