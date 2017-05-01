/**
 * Created by umut.taherzadeh on 2017-04-23.
 */
var DB = require("../bin/database");

// rest services going to be implement under this section
module.exports = {
    "createRecords": function (callback) {

        var connection = DB.getConnection();

        for (var i = 0; i < 5; i++) {

            var sql = " INSERT INTO deneme.simple_table " +
                "(OID, CREATED, COLUMN1, COLUMN2, COLUMN3)" +
                " VALUES ( " +
                "'" + DB.generateOid() + "', " +
                "'" + "23042017214600" + "', " +
                "'col 1 value', " +
                "'col 2 value', " +
                "'col 3 value' " +
                ");";

            connection.query(sql);
        }
        DB.closeConnection();
    },

    'readRecords': function (callback) {

        var connection = DB.getConnection();
        var returnArr;
        connection.query('SELECT * from simple_table', function (err, rows, fields) {
            if (!err) {
                returnArr = rows;
                DB.closeConnection();
                callback(returnArr);
            }
            else {
                console.error('Error while performing Query.');
                DB.closeConnection();
            }
        });
    },

    'updateRecords': function () {

        var connection = DB.getConnection();
        connection.query('SELECT * from simple_table', function (err, rows, fields) {
            if (!err) {

                for (var i = 0; i < rows.length; i++) {
                    var update =
                        " UPDATE " +
                        " deneme.simple_table " +
                        " SET " +
                        " COLUMN1 = '" + Math.random() * 5000 + "', " +
                        " COLUMN2 = '" + Math.random() * 5000 + "', " +
                        " COLUMN3 = '" + Math.random() * 5000 + "'  " +
                        " WHERE " +
                        " OID = '" + rows[i].OID + "'";

                    connection.query(update);
                }

                DB.closeConnection();
            }
            else {
                console.error('Error while performing Query.');
                DB.closeConnection();
            }
        });

    },

    'deleteRecords': function () {

        var connection = DB.getConnection();
        connection.query('SELECT * from simple_table', function (err, rows, fields) {
            if (!err) {

                for (var i = 0; i < rows.length; i++) {
                    var del =
                        " DELETE FROM " +
                        " deneme.simple_table " +
                        " WHERE " +
                        " OID = '" + rows[i].OID + "'";

                    connection.query(del);
                }

                DB.closeConnection();
            }
            else {
                console.error('Error while performing Query.');
                DB.closeConnection();
            }
        });
    }

};