var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var apiController = new Controller();

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

apiController.before('*', function(next) {
	if(!this.req.isAuthenticated()){
    	this.redirect('/login');
  	} else {
      	console.log('Session Expires in ' + this.req.session.cookie.maxAge / 1000 / 60 + ' minutes');
  		next();
  	}
});

module.exports = apiController;
