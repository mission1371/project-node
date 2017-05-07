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


CustomerMessage.prototype.getSQLInsert = function () {

    return " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_MESSAGE_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, MESSAGE_ID)" +
        " VALUES ( " +
        "'" + this.id + "', " +
        "'" + this.createdDateTime + "', " +
        "'" + this.customerId + "', " +
        "'" + this.messageId + "'" +
        ");";
};

module.exports = CustomerMessage;