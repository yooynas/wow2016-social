/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
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

pagesController.data = function() {
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
