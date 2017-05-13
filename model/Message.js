/**
 * Created by umut.taherzadeh on 2017-05-01.
 */

var CONSTANTS = require('../bin/Constants');

// Constructor
function Message() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.sendDateTime = undefined;
    this.from = undefined;
    this.to = undefined;
    this.content = undefined;
    this.isRead = 0;
}

Message.prototype.setId = function (id) {
    this.id = id;
};

Message.prototype.setCreatedDateTime = function (createdDateTime) {
    this.createdDateTime = createdDateTime;
};

Message.prototype.setSendDateTime = function (sendDateTime) {
    this.sendDateTime = sendDateTime;
};

Message.prototype.setFrom = function (from) {
    this.from = from;
};

Message.prototype.setTo = function (to) {
    this.to = to;
};

Message.prototype.setContent = function (content) {
    this.content = content;
};

Message.prototype.setRead = function (isRead) {
    this.isRead = isRead;
};

Message.prototype.generate = function (db) {
    this.setId(db.generateOid());
    this.setCreatedDateTime(db.generateTimestamp());
    this.setSendDateTime(db.generateTimestamp());
    this.setFrom(db.generateRandomString(50));
    this.setTo(db.generateRandomString(50));
    this.setContent(db.generateRandomString(255));
    return this;
};


Message.prototype.getSQLInsert = function (details) {

    if(!details) {
        details = [this];
    }
    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " (ID, CREATED_DATE_TIME, SEND_DATE_TIME, MESSAGE_FROM, MESSAGE_TO, CONTENT, IS_READ)" +
        " VALUES ";

    for (var i = 0; i < details.length - 1; i++) {
        sql = sql + getValueString(details[i]) + ", ";
    }
    sql = sql + getValueString(details[details.length - 1]);

    return sql;

};

Message.prototype.getSQLSelect = function (arr) {
    var sql = " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE ID IN ( ";

    for(var i = 0 ; i < arr.length - 1 ; i++) {
        sql += "'" + arr[i] + "', ";
    }
    return sql + "'" + arr[arr.length - 1] + "' );";
};

Message.prototype.getSQLSelectAll = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE + ";";
};

Message.prototype.getSQLSelectUnread = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE IS_READ = 0 ORDER BY RAND() LIMIT 1;";
};

Message.prototype.getSQLSelectRead = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE IS_READ = 1 ORDER BY RAND() LIMIT 1;";
};

Message.prototype.getSQLUpdate = function (id) {

    return " UPDATE " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " SET " +
        " IS_READ = 1 " +
        " WHERE " +
        " ID = '" + id + "'";
};

Message.prototype.getSQLDelete = function (id) {

    return " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE " +
        " ID = '" + id + "'";
};

Message.prototype.getSQLDeleteMultiple = function (arr) {
    var sql = " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE ID IN ( ";

    for(var i = 0 ; i < arr.length - 1 ; i++) {
        sql += "'" + arr[i] + "', ";
    }
    return sql + "'" + arr[arr.length - 1] + "' );";
};

function getValueString(detail) {
    return "( " +
        "'" + detail.id + "', " +
        "'" + detail.createdDateTime + "', " +
        "'" + detail.sendDateTime + "', " +
        "'" + detail.from + "', " +
        "'" + detail.to + "', " +
        "'" + detail.content + "', " +
        "'" + detail.isRead + "'" +
        ")";
}

module.exports = Message;