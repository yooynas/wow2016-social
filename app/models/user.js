/** user.js **/
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
