/**
 * Created by umut.taherzadeh on 2017-05-07.
 */

var CONSTANTS = require('../bin/Constants');

// Constructor
function Customer() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.name = undefined;
    this.lastName = undefined;
    this.dateOfBirth = undefined;
}

Customer.prototype.setId = function (id) {
    this.id = id;
};

Customer.prototype.getId = function () {
    return this.id;
};

Customer.prototype.setCreatedDateTime = function (createdDateTime) {
    this.createdDateTime = createdDateTime;
};

Customer.prototype.setName = function (name) {
    this.name = name;
};

Customer.prototype.setLastName = function (lastName) {
    this.lastName = lastName;
};

Customer.prototype.generate = function (connection) {
    this.id = connection.generateOid();
    this.createdDateTime = connection.generateTimestamp();
    this.name = connection.generateRandomString(100);
    this.lastName = connection.generateRandomString(100);
    this.dateOfBirth = connection.getDate();
    return this;
};


Customer.prototype.getSQLInsert = function () {

    return " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_TABLE +
        " (ID, CREATED_DATE_TIME, NAME, LAST_NAME, DATE_OF_BIRTH)" +
        " VALUES ( " +
        "'" + this.id + "', " +
        "'" + this.createdDateTime + "', " +
        "'" + this.name + "', " +
        "'" + this.lastName + "', " +
        "'" + this.dateOfBirth + "'" +
        ");";
};


module.exports = Customer;