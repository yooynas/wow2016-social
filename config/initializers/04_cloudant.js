/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
var AppUtils = require('../../utils/app-utils');
var Cloudant = require('cloudant');
var cloudantUtils = require('../../app/utils/CloudantUtils');
var fs = require('fs');

module.exports = function() {

	// Get the user id and password from the app-params.json file
	var user = global.app_params["cloudant-username"];
	var password = global.app_params["cloudant-password"];


	// Initialize the library with my account.
	var cloudant = Cloudant({account:user, password:password});

	// Check that the database wow-incoming existist in the service instance...
	cloudantUtils.checkDB(cloudant, 'wow-incoming').then(function(db_connection) {
		console.log('Successfully connected to wow-incoming');
		global['wow-incomingDB'] = db_connection;
		cloudantUtils.checkDesignDoc(db_connection, "wow-incoming", "./cloudant-config/wow-incoming").then(function() {
			console.log('Successfully checked the wow-incoming db design docs');
		});
	}, function(err) {
		console.log('******** Error connecting to wow-incoming : ' + err);
	});

	cloudantUtils.checkDB(cloudant, 'wow-session-info').then(function(db_connection) {
		console.log('Successfully connected to wow-session-info');
		global['wow-session-infoDB'] = db_connection;
		cloudantUtils.checkDesignDoc(db_connection, "wow-session-info", "./cloudant-config/wow-session-info").then(function() {
			console.log('Successfully checked the wow-session-info db design docs');
			try {
				var session_info_data = JSON.parse(fs.readFileSync("./cloudant-config/wow-session-info-data.json"));
				console.log('Number of session info docs in file = ' + session_info_data.docs.length);
			} catch (err) {
				console.log(err);
			}
		});
	}, function(err) {
		console.log('******** Error connecting to wow-session-info : ' + err);
	});
}
