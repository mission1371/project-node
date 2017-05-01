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

Message.prototype.getSQLInsert = function () {

    return " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " (ID, CREATED_DATE_TIME, SEND_DATE_TIME, MESSAGE_FROM, MESSAGE_TO, CONTENT, IS_READ)" +
        " VALUES ( " +
        "'" + this.id + "', " +
        "'" + this.createdDateTime + "', " +
        "'" + this.sendDateTime + "', " +
        "'" + this.from + "', " +
        "'" + this.to + "', " +
        "'" + this.content + "', " +
        "'" + this.isRead + "'" +
        ");";
};

Message.prototype.getSQLSelectAll = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE + ";";
};

Message.prototype.getSQLSelectUnread = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE IS_READ = 0 LIMIT 1;";
};

Message.prototype.getSQLSelectRead = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
        " WHERE IS_READ = 1 LIMIT 1;";
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

module.exports = Message;