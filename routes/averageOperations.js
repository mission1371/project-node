/**
 * Created by umut.taherzadeh on 2017-04-23.
 */
var DB = require("../bin/database");
var Invoice = require('../model/Invoice');
var InvoiceDetail = require('../model/InvoiceDetail');

// rest services going to be implement under this section
module.exports = {
    "createInvoice": function (callback) {

        var connection = DB.getConnection();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();

        invoice.setId(DB.generateOid());
        invoice.setCreatedDateTime(DB.generateTimestamp());
        invoice.setCustomerId(DB.generateOid());
        invoice.setInvoiceNumber(DB.generateNumber());
        invoice.setInvoiceDate(DB.getDate());
        invoice.setDueDate(DB.getDate());
        invoice.setDiscount(parseInt(Math.random() * 10), 10);

        var total = 0;
        var lineNumber = parseInt((Math.random() * 1000) & 100, 10);
        var details = [];
        for (var i = 0; i < lineNumber; i++) {

            var line = new InvoiceDetail();
            line.setId(DB.generateOid());
            line.setCreatedDateTime(DB.generateTimestamp());
            line.setInvoiceId(invoice.getId());
            line.setItemName(DB.generateRandomString(100));
            line.setItemDescription(DB.generateRandomString(1000));
            line.setUnitPrice(DB.generateDecimal());
            line.setQuantity(DB.generateNumber(10));
            line.setLineTotal(line.getUnitPrice() * line.getQuantity());
            total = total + line.getLineTotal();
            details.push(line);
        }

        invoice.setTotal(total);

        var sqlMaster = invoice.getSQLInsert();
        var sqlDetail = invoiceDetail.getSQLInsert(details);

        connection.query(sqlMaster, function (error, results, fields) {
            if (!error) {
                console.info(invoice.id + " created");
                connection.query(sqlDetail, function (error, results, fields) {
                    if (!error) {
                        console.info(details.length + " detail for " + invoice.id + " created");
                        callback(null);
                    }
                    else {
                        callback(error);
                        console.error('Error while performing Query.');
                        console.error(error);
                    }
                });
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        });

    },

    'readInvoice': function (callback) {
        var connection = DB.getConnection();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();
        connection.query(invoice.getSQLSelectAll(), function (err, results, fields) {
            if (!err) {
                getInvoiceDetail(results, function (invoices) {
                    console.info(invoices.length + " selected");
                    callback(invoices);
                });
            }
            else {
                callback(err);
                console.error('Error while performing Query.');
                console.error(err);
            }
        });

        function getInvoiceDetail(invoices, cb) {
            var returnArr = [];
            var pending = invoices.length;

            for (var i in invoices) {
                connection.query(invoiceDetail.getSQLSelect(invoices[i].ID), function (err, results, fields) {
                    var obj = {
                        "master": invoices[i],
                        "detail": results
                    };
                    returnArr.push(obj);
                    if (0 === --pending) {
                        cb(returnArr); //callback if all queries are processed
                    }
                });
            }
        }

    },

    'updateRecords': function () {

        var connection = DB.getConnection();
        var message = new Message();
        connection.query(message.getSQLSelectUnread(), function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    connection.query(message.getSQLUpdate(rows[0].ID));
                    console.info(rows[0].ID + " updated");
                    callback(rows[0]);
                }
                else {
                    callback();
                }
            }
            else {
                callback(err);
                console.error('Error while performing Query.');
                console.error(err);
            }
        });

    },

    'deleteRecords': function () {

        var connection = DB.getConnection();
        connection.query('SELECT * from simple_table', function (err, rows, fields) {
            if (!err) {

                for (var i = 0; i < rows.length; i++) {
                    var del =
                        " DELETE FROM " +
                        " deneme.simple_table " +
                        " WHERE " +
                        " OID = '" + rows[i].OID + "'";

                    connection.query(del);
                }

                DB.closeConnection();
            }
            else {
                console.error('Error while performing Query.');
                DB.closeConnection();
            }
        });
    }

};