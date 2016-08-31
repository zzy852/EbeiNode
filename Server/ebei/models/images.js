/**
 * images.js
 * @zzy
 * @date    2015-02-06 17:26:01
 * @version 1.0.0
 */
var imageSql = require('../global/mysql.js');
function Image(image) {
    this.uploadUserid = image.uploadUserid;
    this.imageName = image.imageName;
    this.imageUrl = image.imageUrl;
}
module.exports = Image;

imageSql.getConnection(function(connection) {

    //保存数据
    Image.prototype.save = function save(callback) {
        var image = {
            uploadUserid: this.uploadUserid,
            imageName: this.imageName,
            imageUrl: this.imageUrl
        };

        var insertUser_Sql = "INSERT INTO imagesinfo(id,uploadUserid,imageName,imageUrl,uploadTime) VALUES(0,?,?,?,now())";

        imageSql.querySql(connection,insertUser_Sql, [image.uploadUserid, image.imageName, image.imageUrl], function(err, result) {
            callback(err, result);
        });
    };

    //根据用户ID得到用户上传的图片
    Image.getUserImagesByUserId = function getUserImagesByUserId(uploadUserid, callback) {

        var getUserImagesByUserId_Sql = "SELECT * FROM imagesinfo WHERE uploadUserid = ?";

        imageSql.querySql(connection,getUserImagesByUserId_Sql, [uploadUserid], function(err, result) {
            callback(err, result);
        });
    };

    //根据用户名得到用户上传的图片
    Image.getUserImagesByUserName = function getUserByUserName(username, callback) {

        var getUserByUserName_Sql = "SELECT u.id AS userid,i.id AS imageid,i.imageUrl,i.imageName FROM userinfo u LEFT JOIN imagesinfo i ON u.id=i.uploadUserid WHERE u.UserName = ? ORDER BY i.uploadTime DESC";

        imageSql.querySql(connection,getUserByUserName_Sql, [username], function(err, result) {
            callback(err, result);
        });
    };

});