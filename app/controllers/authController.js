/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
var locomotive = require('locomotive');
var passport = require('passport');
var flash = require('connect-flash');
var Controller = locomotive.Controller;

var AuthController = new Controller();

AuthController.login = function() {
  this.title = 'Watson Social CRM Dashboard';
  // Use the <%=message%> tag on the login page to display the flash message
  this.message = '';
  if (this.req.flash) {
    this.message = this.req.flash('error');
  }
  if (this.message == 'undefined' || this.message.length == 0) {
  	this.message = 'Please sign in.';
    this.alert_type = 'alert-info';
  } else {
    this.alert_type = 'alert-danger';
  }
  this.render();
}

// This is the route used to authenticate a user.
AuthController.authenticate = function() {
  this.__res.header('Access-Control-Allow-Credentials', true);
	// The local strategy in the passport initializer will be used.
	// Set failureFlash to true to enable the flash message to be available
	// Then call the returned 'next()' function with the req, resp, and next
	passport.authenticate('local', {
    	successRedirect: '/',
    	failureRedirect: '/login',
    	failureFlash: true }
  	)(this.__req, this.__res, this.__next);
}

AuthController.logout = function() {
    this.req.session.destroy();
  	this.req.logout();

    this.res.redirect('/login');
}

module.exports = AuthController;
