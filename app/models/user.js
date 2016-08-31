/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
var User = function (profile) {
    this.profile = profile;
}

User.prototype.profile = { };

User.findById = function (id, callback) {
	var profile = users[id];
	if (profile) {
    	return callback(null, new User(profile));
    } else {
    	return callback('Incorrect username.', null);
    }
}

User.prototype.checkPassword = function (password) {
	if (password != this.profile.password) {
		return false;
	}
	return true;
}

var users = {
	"watson" : {
		username: "watson",
		email : "thomas.j.watson@ibm.com",
		password : "w@ts0n",
		name : "Thomas J. Watson",
		job : "Someone Important" }
};

module.exports = User;
