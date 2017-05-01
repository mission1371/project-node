/**
 * Created by umut.taherzadeh on 2017-04-23.
 */
var DB = require("../bin/database");
var Message = require('../model/Message');

// rest services going to be implement under this section
module.exports = {
    "createMessage": function (callback) {

        var connection = DB.getConnection();
        var message = new Message();

        message.setId(DB.generateOid());
        message.setCreatedDateTime(DB.generateTimestamp());
        message.setSendDateTime(DB.generateTimestamp());
        message.setFrom(DB.generateRandomString(50));
        message.setTo(DB.generateRandomString(50));
        message.setContent(DB.generateRandomString(255));

        var sql = message.getSQLInsert();
        connection.query(sql, function (error, results, fields) {
            if (!error) {
                console.info(message.id + " created");
                callback(null);
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        });

    },

    'readMessages': function (callback) {

        var connection = DB.getConnection();
        var message = new Message();
        connection.query(message.getSQLSelectAll(), function (err, results, fields) {
            if (!err) {
                console.info(results.length + " selected");
                callback(results);
            }
            else {
                callback(err);
                console.error('Error while performing Query.');
                console.error(err);
            }
        });
    },

    'updateMessage': function (callback) {

        var connection = DB.getConnection();
        var message = new Message();
        connection.query(message.getSQLSelectUnread(), function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    connection.query(message.getSQLUpdate(rows[0].ID));
                    console.info(rows[0].ID + " updated");
                    callback(rows[0]);
                }
                else {
                    callback();
                }
            }
            else {
                callback(err);
                console.error('Error while performing Query.');
                console.error(err);
            }
        });

    },

    'deleteMessage': function (callback) {

        var connection = DB.getConnection();
        var message = new Message();
        connection.query(message.getSQLSelectRead(), function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    connection.query(message.getSQLDelete(rows[0].ID));
                    console.info(rows[0].ID + " deleted");
                    callback();
                }
                else {
                    callback();
                }
            }
            else {
                callback(err);
                console.error('Error while performing Query.');
                console.error(err);
            }
        });
    }

};