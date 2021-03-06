/**
 * Created by umut.taherzadeh on 2017-05-07.
 */


var CONSTANTS = require('../bin/Constants');

// Constructor
function CustomerPayment() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.customerId = undefined;
    this.invoiceId = undefined;
    this.total = 0;
    this.amount = 0;
    this.remaining = 0;
}

CustomerPayment.prototype.setId = function (id) {
    this.id = id;
};
CustomerPayment.prototype.setCreatedDateTime = function (createdDateTime) {
    this.createdDateTime = createdDateTime;
};
CustomerPayment.prototype.setCustomerId = function (customerId) {
    this.customerId = customerId;
};
CustomerPayment.prototype.setInvoiceId = function (invoiceId) {
    this.invoiceId = invoiceId;
};
CustomerPayment.prototype.setTotal = function (total) {
    this.total = total;
};
CustomerPayment.prototype.setAmount = function (amount) {
    this.amount = amount;
};
CustomerPayment.prototype.setRemaining = function (remaining) {
    this.remaining = remaining;
};

CustomerPayment.prototype.getSQLInsert = function (payments) {

    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_PAYMENT_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, INVOICE_ID, TOTAL, AMOUNT, REMAINING)" +
        " VALUES ";

    for (var i = 0; i < payments.length - 1; i++) {
        sql = sql + getValueString(payments[i]) + ", ";
    }
    sql = sql + getValueString(payments[payments.length - 1]);

    return sql;
};

CustomerPayment.prototype.getSQLSelect = function (customerId) {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_PAYMENT_TABLE +
        " WHERE CUSTOMER_ID = '" + customerId + "';";
};

CustomerPayment.prototype.getSQLSelectInvoices = function (customerId) {

    return " SELECT * FROM "
        + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE + " i, "
        + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_PAYMENT_TABLE + " cp "
        + " WHERE cp.CUSTOMER_ID = '" + customerId + "'"
        + " AND i.ID = cp.INVOICE_ID;";

};

CustomerPayment.prototype.getSQLDeleteMultiple = function (arr) {
    var sql = " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.CUSTOMER_PAYMENT_TABLE +
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
        "'" + detail.invoiceId + "', " +
        "'" + detail.total + "', " +
        "'" + detail.amount + "', " +
        "'" + detail.remaining + "'" +
        ")";
}

module.exports = CustomerPayment;