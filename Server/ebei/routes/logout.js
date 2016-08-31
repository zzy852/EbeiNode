/**
 * logout.js
 * @zzy
 * @date    2015-02-06 17:38:00
 * @version 1.0.0
 */

var express, router;
express = require('express');
router = express.Router();

router.get('/', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;