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
    "generateNumber": function (precision) {
        precision = precision ? precision : 100000;
        return (parseInt(Math.random() * 100000, 10) % precision) + 1;
    },
    "generateDecimal": function () {
        var numPrecision = parseInt(((Math.random() * 100) % 10), 10) + 1;
        var numScale = parseInt(((Math.random() * 10) % 4), 10) + 1;

        var precision = "";
        var scale = "";
        for (var i = 0; i < numPrecision; i++) {
            precision = precision + parseInt(Math.random() * 10, 10);
        }

        for (var k = 0; k < numScale; k++) {
            scale = scale + parseInt(Math.random() * 10, 10);
        }
        return parseFloat(precision + "." + scale);
    },
    "generateTimestamp": function () {
        return moment().format("YYYYMMDDHHmmSS");
    },
    "getDate": function () {
        return moment().format("YYYYMMDD");
    },
    "generateRandomString": function (len) {
        var text = "";
        var chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789 ";

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


