/**
 * Created by umut.taherzadeh on 2017-05-07.
 */


var CONSTANTS = require('../bin/Constants');

// Constructor
function CustomerMessage() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.customerId = undefined;
    this.messageId = undefined;
}

CustomerMessage.prototype.setId = function(id) {
    this.id = id;
};

CustomerMessage.prototype.setCreatedDateTime = function(createdDateTime) {
    this.createdDateTime = createdDateTime;
};

CustomerMessage.prototype.setCustomerId = function(customerId) {
    this.customerId = customerId;
};

CustomerMessage.prototype.setMessageId = function(messageId) {
    this.messageId = messageId;
};

CustomerMessage.prototype.generate = function (db, customerId, messageId) {
    this.id = db.generateOid();
    this.createdDateTime = db.generateTimestamp();
    this.customerId = customerId;
    this.messageId = messageId;
    return this;
};


CustomerMessage.prototype.getSQLInsert = function (details) {

    if(!details) {
        details = [this];
    }
    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_MESSAGE_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, MESSAGE_ID)" +
        " VALUES ";

    for (var i = 0; i < details.length - 1; i++) {
        sql = sql + getValueString(details[i]) + ", ";
    }
    sql = sql + getValueString(details[details.length - 1]);

    return sql;
};

CustomerMessage.prototype.getSQLSelect = function (customerid) {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_MESSAGE_TABLE +
        " WHERE CUSTOMER_ID = '" + customerid + "';";
};

CustomerMessage.prototype.getSQLSelectMessages = function (customerid) {

    return " SELECT * FROM "
        + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE + " m, "
        + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_MESSAGE_TABLE + " cm "
        + " WHERE cm.CUSTOMER_ID = '" + customerid + "'"
        + " AND m.ID = cm.MESSAGE_ID;";
};

CustomerMessage.prototype.getSQLDeleteMultiple = function (arr) {
    var sql = " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_MESSAGE_TABLE +
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
        "'" + detail.customerId + "', " +
        "'" + detail.messageId + "'" +
        ")";
}


module.exports = CustomerMessage;