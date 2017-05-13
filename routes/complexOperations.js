/**
 * Created by umut.taherzadeh on 2017-04-23.
 */
var DB = require("../bin/database");
var Customer = require('../model/Customer');
var CustomerAddress = require('../model/CustomerAddress');
var CustomerMessage = require('../model/CustomerMessage');
var CustomerPayment = require('../model/CustomerPayment');
var Message = require('../model/Message');
var Invoice = require('../model/Invoice');
var InvoiceDetail = require('../model/InvoiceDetail');

// rest services going to be implement under this section
module.exports = {
    "createOperations": function (callback) {

        var connection = DB.getConnection();

        var obj = {
            "customer": {},
            "messages": [],
            "addresses": [],
            "payments": [],
            "invoice": {
                "master": {},
                "detail": []
            }
        };
        var numOfOperations = 7;
        var flag = 0;
        var customer = new Customer().generate(DB);
        var message = new Message().generate(DB);
        var customerMessage = new CustomerMessage().generate(DB, customer.id, message.id);
        var invoice = new Invoice().generate(DB);

        var customerAddresses = new CustomerAddress();
        var invoiceDetail = new InvoiceDetail();
        var customerPayment = new CustomerPayment();

        var numOfAddress = (parseInt(Math.random() * 10, 10) % 5) + 1;
        for (var i = 0; i < numOfAddress; i++) {
            obj.addresses.push(new CustomerAddress().generate(DB, customer.id));
        }

        var total = 0;
        var numOfInvoiceLine = (parseInt(Math.random() * 1000, 10) % 100) + 1;
        for (var k = 0; k < numOfInvoiceLine; k++) {
            obj.invoice.detail.push(new InvoiceDetail().generate(DB, invoice.id));
            total = total + obj.invoice.detail[k].lineTotal;
        }
        invoice.setTotal(total);
        invoice.setCustomerId(customer.getId());

        var numOfPayment = (parseInt(Math.random() * 10, 10) % 10) + 1;
        var remaining = total;
        for (var j = 0; j < numOfPayment; j++) {
            var payment = new CustomerPayment();
            payment.id = DB.generateOid();
            payment.createdDateTime = DB.generateTimestamp();
            payment.customerId = customer.id;
            payment.invoiceId = invoice.id;
            payment.total = total;
            payment.amount = total / numOfPayment;
            remaining = remaining - payment.amount;
            payment.remaining = remaining;
            obj.payments.push(payment);
        }

        /** ---> save customer **/
        connection.query(customer.getSQLInsert(), function (error, results, fields) {
            obj.customer = customer;
            finish(error, ++flag);
        });

        /** ---> save message **/
        connection.query(message.getSQLInsert(), function (error, results, fields) {
            obj.messages.push(message);
            finish(error, ++flag);
        });

        /** ---> save message relation **/
        connection.query(customerMessage.getSQLInsert(), function (error, results, fields) {
            finish(error, ++flag);
        });

        /** ---> save addresses **/
        connection.query(customerAddresses.getSQLInsert(obj.addresses), function (error, results, fields) {
            finish(error, ++flag);
        });

        /** ---> save invoice master **/
        connection.query(invoice.getSQLInsert(), function (error, results, fields) {
            obj.invoice.master = invoice;
            finish(error, ++flag);
        });

        /** ---> save invoice detail **/
        connection.query(invoiceDetail.getSQLInsert(obj.invoice.detail), function (error, results, fields) {
            finish(error, ++flag);
        });

        /** ---> save payment **/
        connection.query(customerPayment.getSQLInsert(obj.payments), function (error, results, fields) {
            finish(error, ++flag);
        });

        function finish(error, num) {
            console.log("check");
            if (!error) {
                if (num == numOfOperations) {
                    console.log("returned");
                    callback(obj);
                }
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        }

    },

    'readRecords': function (callback) {

        var connection = DB.getConnection();
        var flag = 0;
        var result = [];
        var customer = new Customer();

        connection.query(customer.getSQLSelectAll(), function (error, results, fields) {
            if (!error) {
                if (results.length > 0) {
                    flag = results.length;
                    for (var i = 0; i < results.length; i++) {
                        fetchRecord(results[i], function (error, obj) {
                            process(error, --flag, obj);
                        })
                    }
                }
                else {
                    callback();
                }
            }
            else {
                console.error('Error while performing Query.');
                console.error(error);
                callback(error);
            }
        });

        function process(error, num, obj) {
            console.log("check");
            if (!error) {
                result.push(obj);
                if (num == 0) {
                    console.log("returned");
                    callback(result);
                }
            }
            else {
                callback(error);
                console.error('Error while performing Query.');
                console.error(error);
            }
        }

    },

    'updateRecords': function (callback) {

        var connection = DB.getConnection();
        var customer = new Customer();
        var message = new Message();
        var customerMessage = new CustomerMessage();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();
        var customerPayment = new CustomerPayment();

        var messages = [];
        var messageRelations = [];
        var invoices = [];
        var invoiceDetails = [];
        var invoiceRelations = [];

        var flag = 0;
        var numOfOperations = 5;

        connection.query(customer.getSQLSelectOne(), function (error, results, fields) {
            if (!error) {
                if (results.length > 0) {
                    var oid = results[0].ID;

                    var num = (parseInt(Math.random() * 10, 10) % 9) + 1;
                    for(var i = 0 ; i < num ; i++) {
                        messages.push(new Message().generate(DB));
                        messageRelations.push(new CustomerMessage().generate(DB, oid, messages[i].id));
                    }

                    for(var j = 0 ; j < num ; j++) {
                        invoices.push(new Invoice().generate(DB));
                        var lines = [];
                        var total = 0;
                        var numOfInvoiceLine = (parseInt(Math.random() * 1000, 10) % 100) + 1;
                        for (var k = 0; k < numOfInvoiceLine; k++) {
                            lines.push(new InvoiceDetail().generate(DB, invoices[j].getId()));
                            total = total + lines[k].lineTotal;
                            invoiceDetails.push(lines[k]);
                        }
                        invoices[j].setTotal(total);
                        invoices[j].setCustomerId(oid);

                        var numOfPayment = (parseInt(Math.random() * 10, 10) % 10) + 1;
                        var remaining = total;
                        for (var l = 0; l < numOfPayment; l++) {
                            var payment = new CustomerPayment();
                            payment.id = DB.generateOid();
                            payment.createdDateTime = DB.generateTimestamp();
                            payment.customerId = oid;
                            payment.invoiceId = invoices[j].getId();
                            payment.total = total;
                            payment.amount = total / numOfPayment;
                            remaining = remaining - payment.amount;
                            payment.remaining = remaining;
                            invoiceRelations.push(payment);
                        }
                    }

                    /** ---> save messages **/
                    connection.query(message.getSQLInsert(messages), function (error, results, fields) {
                        process(error, ++flag);
                    });

                    /** ---> save message relation **/
                    connection.query(customerMessage.getSQLInsert(messageRelations), function (error, results, fields) {
                        process(error, ++flag);
                    });

                    /** ---> save invoice master **/
                    connection.query(invoice.getSQLInsert(invoices), function (error, results, fields) {
                        process(error, ++flag);
                    });

                    /** ---> save invoice detail **/
                    connection.query(invoiceDetail.getSQLInsert(invoiceDetails), function (error, results, fields) {
                        process(error, ++flag);
                    });

                    /** ---> save payment **/
                    connection.query(customerPayment.getSQLInsert(invoiceRelations), function (error, results, fields) {
                        process(error, ++flag);
                    });


                }
                else {
                    callback();
                }
            }
            else {
                console.error('Error while performing Query.');
                console.error(error);
                callback(error);
            }
        });

        function process(error, num) {
            console.log("process");
            if (!error) {
                if (num == numOfOperations) {
                    console.log("returned");
                    callback();
                }
            }
            else {
                console.error('Error while performing Query.');
                console.error(error);
                callback(error);
            }
        }

    },

    'deleteRecords': function (callback) {

        var flag = 0;
        var numOfOperations = 7;

        var connection = DB.getConnection();

        var customer = new Customer();
        var message = new Message();
        var customerMessage = new CustomerMessage();
        var invoice = new Invoice();
        var invoiceDetail = new InvoiceDetail();

        var customerAddresses = new CustomerAddress();
        var customerPayment = new CustomerPayment();

        /** ---> Select Customer **/
        connection.query(customer.getSQLSelectOne(), function (error, results, fields) {
            if (!error) {
                if (results.length > 0) {
                    var oid = results[0].ID;

                    /** ---> get message relations **/
                    connection.query(customerMessage.getSQLSelect(oid), function (error, results, fields) {
                        if (!error) {
                            console.info("message realtions for " + oid + " selected");
                            if (results.length > 0) {
                                console.info(results.length + " message relations found for " + oid);
                                var arrMessage = [];
                                var arrRelation = [];
                                for (var i = 0; i < results.length; i++) {
                                    arrRelation.push(results[i].ID);
                                    arrMessage.push(results[i].MESSAGE_ID);
                                }
                                connection.query(message.getSQLDeleteMultiple(arrMessage), function (error, results, fields) {
                                    console.info(results.length + " message deleted for " + oid);
                                    process(error, ++flag);
                                });

                                connection.query(customerMessage.getSQLDeleteMultiple(arrRelation), function (error, results, fields) {
                                    console.info(results.length + " message relations deleted for " + oid);
                                    process(error, ++flag);
                                });
                            }
                            else {
                                callback();
                            }
                        }
                        else {
                            console.error('Error while performing Query.');
                            console.error(error);
                            callback(error);
                        }
                    });

                    /** ---> delete address **/
                    connection.query(customerAddresses.getSQLDelete(oid), function (error, results, fields) {
                        console.log("customer addresses deleted");
                        process(error, ++flag);
                    });

                    /** ---> get invoice relations **/
                    connection.query(customerPayment.getSQLSelect(oid), function (error, results, fields) {
                        if (!error) {
                            console.info("payment relations for " + oid + " selected");
                            if (results.length > 0) {
                                console.info(results.length + " payment relations found for " + oid);
                                var arrInvoice = [];
                                var arrRelation = [];
                                for (var i = 0; i < results.length; i++) {
                                    arrRelation.push(results[i].ID);
                                    arrInvoice.push(results[i].INVOICE_ID);
                                }

                                /** delete invoice details **/
                                connection.query(invoiceDetail.getSQLDeleteMultiple(arrInvoice), function (error, results, fields) {
                                    console.info(arrInvoice.length + " invoice deleted for " + oid);
                                    process(error, ++flag);
                                });

                                /** delete invoices **/
                                connection.query(invoice.getSQLDeleteMultiple(arrInvoice), function (error, results, fields) {
                                    console.info(" invoice details deleted for " + oid);
                                    process(error, ++flag);
                                });

                                /** delete customer payments **/
                                connection.query(customerPayment.getSQLDeleteMultiple(arrRelation), function (error, results, fields) {
                                    console.info(results.length + " message relations deleted for " + oid);
                                    process(error, ++flag);
                                });
                            }
                            else {
                                callback();
                            }
                        }
                        else {
                            console.error('Error while performing Query.');
                            console.error(error);
                            callback(error);
                        }
                    });

                    /** ---> delete customer **/
                    connection.query(customer.getSQLDelete(oid), function (error, results, fields) {
                        console.log("customer deleted");
                        process(error, ++flag);
                    });
                }
                else {
                    callback();
                }
            }
            else {
                console.error('Error while performing Query.');
                console.error(error);
                callback(error);
            }
        });

        function process(error, num) {
            console.log("process");
            if (!error) {
                if (num == numOfOperations) {
                    console.log("returned");
                    callback();
                }
            }
            else {
                console.error('Error while performing Query.');
                console.error(error);
                callback(error);
            }
        }

    }

};


function fetchRecord(customer, callback) {

    var connection = DB.getConnection();
    var oid = customer.ID;

    var obj = {
        "customer": customer,
        "messages": [],
        "addresses": [],
        "payments": [],
        "invoices" : []
    };

    var numOfOperations = 4;
    var flag = 0;
    var customerMessage = new CustomerMessage();
    var customerAddress = new CustomerAddress();
    var customerPayment = new CustomerPayment();

    /** fetch messages **/
    connection.query(customerMessage.getSQLSelectMessages(oid), function (error, results, fields) {
        obj.messages = results;
        process(error, ++flag);
    });

    /** fetch addresses **/
    connection.query(customerAddress.getSQLSelect(oid), function (error, results, fields) {
        obj.addresses = results;
        process(error, ++flag);
    });

    /** fetch payments **/
    connection.query(customerPayment.getSQLSelect(oid), function (error, results, fields) {
        obj.payments = results;
        process(error, ++flag);
    });

    /** fetch invoices **/
    connection.query(customerPayment.getSQLSelectInvoices(oid), function (error, results, fields) {
        obj.invoices = results;
        process(error, ++flag);
    });

    // TODO invoice details

    function process(error, num) {
        console.log("process");
        if (!error) {
            if (num == numOfOperations) {
                console.log("returned");
                callback(null, obj);
            }
        }
        else {
            console.error('Error while performing Query.');
            console.error(error);
            callback(error);

        }
    }


}