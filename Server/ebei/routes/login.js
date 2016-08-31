/**
 * login.js
 * @zzy
 * @date    2015-02-06 17:35:06
 * @version 1.0.0
 */

var express, router, User, crypto, TITLE_LOGIN, TITLE_REG;
express = require('express');
router = express.Router();
User = require('../models/user.js');
crypto = require('crypto');
TITLE_LOGIN = '欢迎回来';
TITLE_REG = '加入分图';

router.get('/', function(req, res) {
    res.locals.stat = 'login';
	res.render('login', {
		title: TITLE_LOGIN
	});
});

router.post('/', function(req, res) {
    res.locals.stat = 'login';
	var action = req.body['action'];
	switch (action) {
		case "login":
			login(req, res);
			break;
		case "reg":
			regist(req, res);
			break;
		default:
			break;
	}
});

function login(req, res) {
	var userName = req.body['txtUserName'],
		userPwd = req.body['txtUserPwd'],
		isRem = req.body['chbRem'],
		md5 = crypto.createHash('md5');

	res.locals.stat = 'login';

	User.getUserByUserName(userName, function(err, results) {
		if (!results) {
			res.locals.loginerror = '用户不存在';
			res.render('login', {
				title: TITLE_LOGIN
			});
			return;
		}
		if (results.length < 1) {
			res.locals.loginerror = '查询出错请稍后再试';
			res.render('login', {
				title: TITLE_LOGIN
			});
			return;
		}

		userPwd = md5.update(userPwd).digest('hex');
		if (results[0].UserName != userName || results[0].UserPass != userPwd) {
			res.locals.loginerror = '用户名或密码有误';
			res.render('login', {
				title: TITLE_LOGIN
			});
			console.log(1);
			return;
		} else {
			if (isRem) {
				res.cookie('islogin', userName, {
					maxAge: 60000
				});
			}

			res.locals.username = userName;
			res.locals.userface = results[0].UserFace;
			res.locals.usernick = results[0].UserNick;
			req.session.username = res.locals.username;
			console.log(req.session.username);
			res.redirect('/');
			return;
		}
	});
}

function regist(req, res) {
	var userName = req.body['regUserName'],
		userPwd = req.body['regtxtUserPwd'],
		userRePwd = req.body['regtxtUserPwd2'],
		md5 = crypto.createHash('md5');

	userPwd = md5.update(userPwd).digest('hex');

	var newUser = new User({
		username: userName,
		userpass: userPwd
	});

	res.locals.stat = 'reg';
	//检查用户名是否已经存在
	User.getUserNumByName(newUser.username, function(err, results) {

		if (results && results[0]['num'] > 0) {
			err = '用户名已存在';
		}

		if (err) {
			res.locals.regerror = err;
			res.render('login', {
				title: TITLE_REG
			});
			return;
		}

		newUser.save(function(err, result) {
			if (err) {
				res.locals.regerror = err;
				res.render('login', {
					title: TITLE_REG
				});
				return;
			}

			if (result.insertId > 0) {
				res.locals.regsuccess = '注册成功,系统将自动登录或请点击   <a class="btn btn-link" href="/login" role="button"> 登录 </a>';
				res.cookie('islogin', userName, {
					maxAge: 60000
				});
				res.locals.username = userName;
				res.locals.userface = results[0].UserFace;
				res.locals.usernick = results[0].UserNick;
				req.session.username = res.locals.username;
				res.redirect('/');
			} else {
				res.locals.regerror = err;
			}

			res.render('login', {
				title: TITLE_REG
			});
		});
	});
}
module.exports = router;