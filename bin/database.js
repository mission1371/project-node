/**
 * Created by umut.taherzadeh on 2017-04-23.
 */

var mysql = require('mysql');
var uuid = require('node-uuid');
var connection;

module.exports = {
    "getConnection": function () {
        if (!connection) {
            connection = createConnection();
        }
        return connection;
    },
    "closeConnection": function () {
        try {
            console.log("trying to close connection");
            connection.end();
            connection = null;
        } catch (e) {
            console.error("failed to close connection");
            console.error(e);
        }
    },
    "generateOid": function () {
        return uuid.v1();
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


