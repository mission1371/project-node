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
        var invoice = new Invoice().generate(DB);
        var invoiceDetail = new InvoiceDetail();

        var total = 0;
        var lineNumber = parseInt((Math.random() * 1000) & 100, 10);
        var details = [];
        for (var i = 0; i < lineNumber; i++) {

            var line = new InvoiceDetail().generate(DB, invoice.getId());

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

    'updateInvoice': function (callback) {

        var connection = DB.getConnection();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();

        connection.query(invoice.getSQLSelectOne(), function (error, results, fields) {
            if (!error) {
                if (results.length > 0) {
                    var invoiceId = results[0].ID;
                    connection.query(invoiceDetail.getSQLSelect(invoiceId), function (error, results, fields) {

                        if (!error) {

                            var total = 0;
                            for(var i = 0 ; i < results.length ; i++) {

                                results[i].UNIT_PRICE = DB.generateDecimal();
                                results[i].QUANTITY = DB.generateNumber(10);
                                results[i].LINE_TOTAL = results[i].UNIT_PRICE * results[i].QUANTITY;
                                total = total + results[i].LINE_TOTAL;
                            }
                            connection.query(invoice.getSQLUpdate(invoiceId, total));
                            connection.query(invoiceDetail.getSQLUpdate(results), function (error, results, fields) {
                                if(!error) {
                                    console.info("children updated");
                                    callback(results);
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
                }
                else {
                    callback();
                }
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        });

    },

    'deleteInvoice': function (callback) {

        var connection = DB.getConnection();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();
        connection.query(invoice.getSQLSelectOne(), function (error, results, fields) {
            if (!error) {
                if (results.length > 0) {
                    connection.query(invoice.getSQLDelete(results[0].ID));
                    console.info(results[0].ID + " deleted");

                    connection.query(invoiceDetail.getSQLDelete(results[0].ID), function (error, results, fields) {
                        if (!error) {
                            console.info("children  deleted");
                            callback(results);
                        }
                        else {
                            callback(error);
                            console.error('Error while performing Query.');
                            console.error(error);
                        }
                    });
                }
                else {
                    callback();
                }
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        });
    }

};