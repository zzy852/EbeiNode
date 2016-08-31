var express, router, formidable,image, fs, AVATAR_UPLOAD_FOLDER;
express = require('express');
router = express.Router();
image = require('../models/images.js');
formidable = require('formidable');
fs = require('fs');
AVATAR_UPLOAD_FOLDER = '/upload/';

router.get('/', function(req, res) {
  if (req.cookies.islogin) {
    console.log('cookies:' + req.cookies.islogin);
    req.session.username = req.cookies.islogin;
  }
  if (req.session.username) {
    console.log('session:' + req.session.username);
    res.locals.username = req.session.username;
  } else {
    res.redirect('/login');
    return;
  }
  image.getUserImagesByUserName(res.locals.username,function(err,result){
    res.locals.userid = result[0].userid;
    res.render('usercenter', {
      content: result,
      title: '用户中心'
    });
  });
});

router.post('/upload', function(req, res) {

  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function(err, fields, files) {

    if (err) {
        res.json({success: false});
      return;
    }

    var extName = ''; //后缀名
    switch (files.qqfile.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }

    if (extName.length === 0) {
      res.json({success: false});
      return;
    }
    var newDate = new Date();
    var avatarName = newDate.getFullYear().toString()+(newDate.getMonth()+1).toString()+newDate.getDate().toString()+newDate.getHours().toString()+newDate.getMinutes().toString()+newDate.getSeconds().toString()+newDate.getMilliseconds().toString()+'_'+ parseInt(Math.random()*10000000) + '.' + extName;
    var newPath = form.uploadDir + avatarName;

    console.log(newPath);
    fs.renameSync(files.qqfile.path, newPath); //重命名

      var newImage = new image({
          uploadUserid: req.query.userId,
          imageName: files.qqfile.name,
          imageUrl: AVATAR_UPLOAD_FOLDER + avatarName
      });

      newImage.save(function(err, result) {
          if (err) {
              res.json({success: false});
              return;
          }

          if (result.insertId > 0) {
              res.json({success: true});
          } else {
              res.json({success: false});
          }
      });
  });

});

module.exports = router;