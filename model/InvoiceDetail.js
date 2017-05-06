/**
 * Created by umut.taherzadeh on 2017-05-06.
 */


var CONSTANTS = require('../bin/Constants');

// Constructor
function InvoiceDetail() {
    this.id = undefined;
    this.createdDateTime = undefined;
    this.invoiceId = undefined;
    this.itemName = undefined;
    this.itemDescription = undefined;
    this.unitPrice = 0;
    this.quantity = 0;
    this.lineTotal = 0;
}

InvoiceDetail.prototype.setId = function (id) {
    this.id = id;
};

InvoiceDetail.prototype.setCreatedDateTime = function (createdDateTime) {
    this.createdDateTime = createdDateTime;
};

InvoiceDetail.prototype.setInvoiceId = function (invoiceId) {
    this.invoiceId = invoiceId;
};

InvoiceDetail.prototype.setItemName = function (itemName) {
    this.itemName = itemName;
};

InvoiceDetail.prototype.setItemDescription = function (itemDescription) {
    this.itemDescription = itemDescription;
};

InvoiceDetail.prototype.setUnitPrice = function (unitPrice) {
    this.unitPrice = unitPrice;
};

InvoiceDetail.prototype.getUnitPrice = function () {
    return this.unitPrice;
};

InvoiceDetail.prototype.setQuantity = function (quantity) {
    this.quantity = quantity;
};

InvoiceDetail.prototype.getQuantity = function () {
    return this.quantity;
};

InvoiceDetail.prototype.setLineTotal = function (lineTotal) {
    this.lineTotal = lineTotal;
};

InvoiceDetail.prototype.getLineTotal = function () {
    return this.lineTotal;
};

InvoiceDetail.prototype.getSQLInsert = function (details) {

    var sql = " INSERT INTO " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_DETAIL_TABLE +
        " (ID, CREATED_DATE_TIME, INVOICE_ID, ITEM_NAME, ITEM_DESCRIPTION, UNIT_PRICE, QUANTITY, LINE_TOTAL)" +
        " VALUES ";

    for (var i = 0; i < details.length - 1; i++) {
        sql = sql + getValueString(details[i]) + ", ";
    }
    sql = sql + getValueString(details[details.length - 1]);

    return sql;
};

InvoiceDetail.prototype.getSQLSelect = function (invoiceId) {
    return " SELECT * FROM " + CONSTANTS.SCHEMA + "." + CONSTANTS.INVOICE_DETAIL_TABLE +
        " WHERE INVOICE_ID = '" + invoiceId + "';";
};

function getValueString(detail) {

    return "( " +
        "'" + detail.id + "', " +
        "'" + detail.createdDateTime + "', " +
        "'" + detail.invoiceId.id + "', " +
        "'" + detail.itemName + "', " +
        "'" + detail.itemDescription + "', " +
        "'" + detail.unitPrice + "', " +
        "'" + detail.quantity + "', " +
        "'" + detail.lineTotal + "'" +
        ")";
}

module.exports = InvoiceDetail;