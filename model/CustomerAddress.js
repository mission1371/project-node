/**
 * Created by umut.taherzadeh on 2017-05-07.
 */


var CONSTANTS = require('../bin/Constants');

// Constructor
function CustomerAddress() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.customerId = undefined;
    this.country = undefined;
    this.state = undefined;
    this.city = undefined;
    this.street = undefined;
    this.zipCode = undefined;
    this.buildingNumber = undefined;
    this.doorNumber = undefined;

}

CustomerAddress.prototype.generate = function (db, customerId) {

    this.id = db.generateOid();
    this.createdDateTime = db.generateTimestamp();
    this.customerId = customerId;
    this.country = db.generateRandomString(50);
    this.state = db.generateRandomString(50);
    this.city = db.generateRandomString(50);
    this.street = db.generateRandomString(255);
    this.zipCode = db.generateRandomString(10);
    this.buildingNumber = db.generateRandomString(10);
    this.doorNumber = db.generateRandomString(10);
    return this;
};


CustomerAddress.prototype.getSQLInsert = function (details) {
    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_ADDRESS_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, COUNTRY, STATE, CITY, STREET, ZIP_CODE, BUILDING_NUMBER, DOOR_NUMBER)" +
        " VALUES ";

    for (var i = 0; i < details.length - 1; i++) {
        sql = sql + getValueString(details[i]) + ", ";
    }
    sql = sql + getValueString(details[details.length - 1]);

    return sql;
};


function getValueString(detail) {

    return "( " +
        "'" + detail.id + "', " +
        "'" + detail.createdDateTime + "', " +
        "'" + detail.customerId + "', " +
        "'" + detail.country + "', " +
        "'" + detail.state + "', " +
        "'" + detail.city + "', " +
        "'" + detail.street + "', " +
        "'" + detail.zipCode + "', " +
        "'" + detail.buildingNumber + "', " +
        "'" + detail.doorNumber + "'" +
        ")";
}


module.exports = CustomerAddress;