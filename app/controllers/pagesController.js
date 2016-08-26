var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.dashboard = function() {
  this.title = 'Watson Social CRM Dashboard';
  this.render();
}

pagesController.chat = function() {
  this.title = 'Watson Social CRM Dashboard';
  this.render();
}

pagesController.before('*', function(next) {
	if(!this.req.isAuthenticated()){
    	this.redirect('/login');
  	} else {
      	console.log('Session Expires in ' + this.req.session.cookie.maxAge / 1000 / 60 + ' minutes');
  		next();
  	}
});

module.exports = pagesController;
