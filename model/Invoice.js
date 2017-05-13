/**
 * Created by umut.taherzadeh on 2017-05-06.
 */

var CONSTANTS = require('../bin/Constants');

// Constructor
function Invoice() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.customerId = undefined;
    this.invoiceNumber = undefined;
    this.invoiceDate = undefined;
    this.dueDate = undefined;
    this.total = 0;
    this.discount = 0;
}

Invoice.prototype.generate = function (db) {
    this.setId(db.generateOid());
    this.setCreatedDateTime(db.generateTimestamp());
    this.setCustomerId(db.generateOid());
    this.setInvoiceNumber(db.generateNumber());
    this.setInvoiceDate(db.getDate());
    this.setDueDate(db.getDate());
    this.setDiscount((Math.random() * 10), 10);
    return this;
};


Invoice.prototype.setId = function (id) {
    this.id = id;
};

Invoice.prototype.getId = function () {
    return this.id;
};

Invoice.prototype.setCreatedDateTime = function (createdDateTime) {
    this.createdDateTime = createdDateTime;
};

Invoice.prototype.setCustomerId = function (customerId) {
    this.customerId = customerId;
};

Invoice.prototype.setInvoiceNumber = function (invoiceNumber) {
    this.invoiceNumber = invoiceNumber;
};

Invoice.prototype.setInvoiceDate = function (invoiceDate) {
    this.invoiceDate = invoiceDate;
};

Invoice.prototype.setDueDate = function (dueDate) {
    this.dueDate = dueDate;
};

Invoice.prototype.setTotal = function (total) {
    this.total = total;
};

Invoice.prototype.setDiscount = function (discount) {
    this.discount = discount;
};

Invoice.prototype.getSQLInsert = function (details) {

    if (!details) {
        details = [this];
    }

    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, INVOICE_NUMBER, INVOICE_DATE, DUE_DATE, TOTAL, DISCOUNT)" +
        " VALUES ";

    for (var i = 0; i < details.length - 1; i++) {
        sql = sql + getValueString(details[i]) + ", ";
    }
    sql = sql + getValueString(details[details.length - 1]);

    return sql;

};

Invoice.prototype.getSQLSelectAll = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE + ";";
};

Invoice.prototype.getSQLSelectOne = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " ORDER BY RAND() LIMIT 1;";
};

Invoice.prototype.getSQLUpdate = function (id, total) {

    return " UPDATE " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " SET " +
        " TOTAL = " + total +
        " WHERE " +
        " ID = '" + id + "'";
};

Invoice.prototype.getSQLDelete = function (id) {

    return " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " WHERE ID = '" + id + "'";
};

Invoice.prototype.getSQLDeleteMultiple = function (arr) {
    var sql = " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " WHERE ID IN ( ";

    for (var i = 0; i < arr.length - 1; i++) {
        sql += "'" + arr[i] + "', ";
    }
    return sql + "'" + arr[arr.length - 1] + "' );";
};

function getValueString(detail) {

    return "( " +
        "'" + detail.id + "', " +
        "'" + detail.createdDateTime + "', " +
        "'" + detail.customerId + "', " +
        "'" + detail.invoiceNumber + "', " +
        "'" + detail.invoiceDate + "', " +
        "'" + detail.dueDate + "', " +
        "'" + detail.total + "', " +
        "'" + detail.discount + "'" +
        ")";
}


module.exports = Invoice;