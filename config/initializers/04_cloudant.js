/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
var AppUtils = require('../../utils/app-utils');
var Cloudant = require('cloudant');
var CloudantUtils = require('../../utils/cloudant-utils');

module.exports = function() {

	// Get the credentials from the VCAP file sitting in the environment
	var cloudant_credentials = global.appEnv.getServiceCreds(global.app_params['cloudant-service-name']);

	var user = cloudant_credentials.username;
	var password = cloudant_credentials.password;

	// Initialize the library with my account.
	var cloudant = Cloudant({account:user, password:password});

	// Check that the database wow-incoming existist in the service instance...
	CloudantUtils.checkDB(cloudant, 'wow-incoming').then(function(db_connection) {
		console.log('Successfully connected to wow-incoming');
		global['wow-incomingDB'] = db_connection;
		CloudantUtils.checkDesignDoc(db_connection, "wow-incoming", "./cloudant-config/wow-incoming").then(function() {
			console.log('Successfully checked the wow-incoming db design docs');
		});
	}, function(err) {
		console.log('******** Error connecting to wow-incoming : ' + err);
	});

	CloudantUtils.checkDB(cloudant, 'wow-session-info').then(function(db_connection) {
		console.log('Successfully connected to wow-session-info');
		global['wow-session-infoDB'] = db_connection;
		CloudantUtils.checkDesignDoc(db_connection, "wow-session-info", "./cloudant-config/wow-session-info").then(function() {
			console.log('Successfully checked the wow-session-info db design docs');
		});
	}, function(err) {
		console.log('******** Error connecting to wow-session-info : ' + err);
	});
}
