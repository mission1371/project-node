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

Invoice.prototype.setId = function (id) {
    this.id = id;
};

Invoice.prototype.getId = function () {
    return this;
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

Invoice.prototype.getSQLInsert = function () {

    return " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE +
        " (ID, CREATED_DATE_TIME, CUSTOMER_ID, INVOICE_NUMBER, INVOICE_DATE, DUE_DATE, TOTAL, DISCOUNT)" +
        " VALUES ( " +
        "'" + this.id + "', " +
        "'" + this.createdDateTime + "', " +
        "'" + this.customerId + "', " +
        "'" + this.invoiceNumber + "', " +
        "'" + this.invoiceDate + "', " +
        "'" + this.dueDate + "', " +
        "'" + this.total + "', " +
        "'" + this.discount + "'" +
        ");";
};

Invoice.prototype.getSQLSelectAll = function () {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_TABLE + ";";
};

// Message.prototype.getSQLSelectUnread = function () {
//     return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
//         " WHERE IS_READ = 0 LIMIT 1;";
// };
//
// Message.prototype.getSQLSelectRead = function () {
//     return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
//         " WHERE IS_READ = 1 LIMIT 1;";
// };
//
// Message.prototype.getSQLUpdate = function (id) {
//
//     return " UPDATE " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
//         " SET " +
//         " IS_READ = 1 " +
//         " WHERE " +
//         " ID = '" + id + "'";
// };
//
// Message.prototype.getSQLDelete = function (id) {
//
//     return " DELETE FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.MESSAGE_TABLE +
//         " WHERE " +
//         " ID = '" + id + "'";
// };

module.exports = Invoice;