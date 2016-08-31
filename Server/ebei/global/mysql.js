/**
 * Created by admin on 16/8/29.
 * mysql连接公共文件
 */

var mysql = require('mysql');
var DB_NAME = 'nodesample';
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: ''
});
function mySql(mySql){

};
module.exports = mySql;

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

// 连接数据库
mySql.getConnection = function getConnection(callback) {
    pool.getConnection(function(err, connection) {
        var useDbSql = "USE " + DB_NAME;
        connection.query(useDbSql, function(err) {
            if (err) {
                console.log("USE Error: " + err.message);
                return;
            }
            console.log('USE succeed');
        });
        callback(connection);
    });
};

// 操作数据库
mySql.querySql = function querySql(connection,queryString,queryParm,callback){
    connection.query(queryString, queryParm, function(err, result) {
        if (err) {
            console.log(queryString +" Error: " + err.message);
            return;
        }

        //connection.release();

        console.log("invoked["+queryString+"]");
        callback(err, result);
    });
}
