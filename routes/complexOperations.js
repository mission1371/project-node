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
            "customer" : {},
            "messages" : [],
            "addresses" : [],
            "payments" : [],
            "invoice" : {
                "master" : {},
                "detail" : []
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
        for(var i = 0 ; i < numOfAddress ; i++) {
            obj.addresses.push(new CustomerAddress().generate(DB, customer.id));
        }

        var total = 0;
        var numOfInvoiceLine = (parseInt(Math.random() * 1000, 10) % 100) + 1;
        for(var k = 0 ; k < numOfInvoiceLine; k++) {
            obj.invoice.detail.push(new InvoiceDetail().generate(DB, invoice.id));
            total = total + obj.invoice.detail[k].lineTotal;
        }
        invoice.setTotal(total);
        invoice.setCustomerId(customer.getId());

        var numOfPayment = (parseInt(Math.random() * 10, 10) % 10) + 1;
        var remaining = total;
        for(var j = 0 ; j < numOfPayment; j++) {
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
            if(!error) {
                if(num == numOfOperations) {
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

        // var connection = DB.getConnection();
        // var returnArr;
        // connection.query('SELECT * from simple_table', function (err, rows, fields) {
        //     if (!err) {
        //         returnArr = rows;
        //         DB.closeConnection();
        //         callback(returnArr);
        //     }
        //     else {
        //         console.error('Error while performing Query.');
        //         DB.closeConnection();
        //     }
        // });
    },

    'updateRecords': function (callback) {

        // var connection = DB.getConnection();
        // connection.query('SELECT * from simple_table', function (err, rows, fields) {
        //     if (!err) {
        //
        //         for (var i = 0; i < rows.length; i++) {
        //             var update =
        //                 " UPDATE " +
        //                 " deneme.simple_table " +
        //                 " SET " +
        //                 " COLUMN1 = '" + Math.random() * 5000 + "', " +
        //                 " COLUMN2 = '" + Math.random() * 5000 + "', " +
        //                 " COLUMN3 = '" + Math.random() * 5000 + "'  " +
        //                 " WHERE " +
        //                 " OID = '" + rows[i].OID + "'";
        //
        //             connection.query(update);
        //         }
        //
        //         DB.closeConnection();
        //     }
        //     else {
        //         console.error('Error while performing Query.');
        //         DB.closeConnection();
        //     }
        // });

    },

    'deleteRecords': function (callback) {

        // var connection = DB.getConnection();
        // connection.query('SELECT * from simple_table', function (err, rows, fields) {
        //     if (!err) {
        //
        //         for (var i = 0; i < rows.length; i++) {
        //             var del =
        //                 " DELETE FROM " +
        //                 " deneme.simple_table " +
        //                 " WHERE " +
        //                 " OID = '" + rows[i].OID + "'";
        //
        //             connection.query(del);
        //         }
        //
        //         DB.closeConnection();
        //     }
        //     else {
        //         console.error('Error while performing Query.');
        //         DB.closeConnection();
        //     }
        // });
    }

};