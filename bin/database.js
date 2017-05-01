/**
 * Created by umut.taherzadeh on 2017-04-23.
 */

var mysql = require('mysql');
var uuid = require('node-uuid');
var moment = require('moment');
var connection;

module.exports = {
    "getConnection": function () {
        if (!connection) {
            connection = createConnection();
        }
        return connection;
    },
    "generateOid": function () {
        return uuid.v1();
    },
    "generateTimestamp": function () {
        return moment().format("YYYYMMDDHHmmSS");
    },
    "generateRandomString": function (len) {
        var text = "";
        var chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789!^+%&/()=?_@.,<>";

        for (var i = 0; i < len; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
    }


};

/**
 * ---------------------------- Private ----------------------
 **/


function createConnection() {

    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'deneme'
    });
}


