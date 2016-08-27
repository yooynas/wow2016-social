var locomotive = require('locomotive')
  , Controller = locomotive.Controller;
var Promise = require('promise');
var Request = require('request');

var apiController = new Controller();

apiController.webConversation = function() {
    var that = this;
    var text = this.req.body.text;
    var user_id = this.req.user.profile.username;

    if (!text) {
      that.res.send(500).json({ "error" : "Text message is required."});
      return;
    }

    callNodeRedWebConversation(text, user_id).then(function(response) {
      that.res.status(200).json(response);
    }, function(err) {
      console.log(err);
      that.res.send(500).json(err);
    });
}

apiController.classification = function() {
  this.res.status(200).json(
    [
      {
        key : "MARKETING",
        value: 2400
      },
      {
        key: "FEEDBACK",
        value: 5001
      },
      {
        key: "QUESTION",
        value: 1134
      }
    ]);
}

apiController.sentiment = function() {
  this.res.status(200).send({
    "positive" : {
      "value" : 50
    },
    "neutrol" : {
      "value": 25
    },
    "negative" : {
      "value" : 25
    }
  });
}


function callNodeRedWebConversation(text, user_id) {
  return new Promise(function(fulfill, reject) {
		try {
      var url = 'https://wow-2016-social.mybluemix.net/web/conversation';
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
