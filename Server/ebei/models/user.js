/**
 * user.js
 * @zzy
 * @date    2015-02-06 17:26:01
 * @version 1.0.0
 */
var userSql = require('../global/mysql.js');
function User(user) {
	this.username = user.username;
	this.userpass = user.userpass;
}
module.exports = User;

userSql.getConnection(function(connection) {

	//保存数据
	User.prototype.save = function save(callback) {
		var user = {
			username: this.username,
			userpass: this.userpass
		};

		var insertUser_Sql = "INSERT INTO userinfo(id,username,userpass) VALUES(0,?,?)";

		userSql.querySql(connection,insertUser_Sql, [user.username, user.userpass], function(err, result) {
			callback(err, result);
		});
	};

	//根据用户名得到用户数量
	User.getUserNumByName = function getUserNumByName(username, callback) {

		var getUserNumByName_Sql = "SELECT COUNT(1) AS num FROM userinfo WHERE username = ?";

		userSql.querySql(connection,getUserNumByName_Sql, [username], function(err, result) {
			callback(err, result);
		});
	};

	//根据用户名得到用户信息
	User.getUserByUserName = function getUserByUserName(username, callback) {

		var getUserByUserName_Sql = "SELECT * FROM userinfo WHERE username = ?";

		userSql.querySql(connection,getUserByUserName_Sql, [username], function(err, result) {
			callback(err, result);
		});
	};

});