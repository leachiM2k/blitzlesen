var path = require('path');
var fs = require('fs');
var events = require('events');
var util = require('util');
var http = require('http');
var express = require('express');
var logger = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var notemplate = require('express-notemplate');
var GoogleSpreadsheet = require("google-spreadsheet");
var shuffle = require('knuth-shuffle').knuthShuffle;

var sheetKey = '1bAPNRFjr83ghmxtIyldtlXJZrNYoQcw1KgsDprbWowM';

var wordlists = {};

function loadWords(handler)
{
    var workbook = new GoogleSpreadsheet(sheetKey);
    workbook.getInfo(function (err, info) {
        if (err) {
            handler(err);
            return;
        }
        var sheets = {};
        function getSheet(sheetNo) {
            var sheet = info.worksheets[sheetNo];
            sheet.getRows(function (err, rows) {
                if (err) {
                    handler(err);
                    return;
                }
                sheets[sheet.title] = rows.map(function (row) { return row.title; });
                if (sheetNo == info.worksheets.length - 1) {
                    handler(null, sheets);
                } else {
                    getSheet(sheetNo + 1);
                }
            });
        }
        getSheet(0);
    });
}

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(methodOverride());
app.use(cookieParser('blikdiblu'));
app.set('statics', process.cwd() + '/public');
app.engine('html', notemplate.__express);
app.set('view engine', 'html');
app.use(express.static(app.get('statics')));
app.use(errorHandler());

var server = http.createServer(app);
app.get('/', function (req, res) {
    res.redirect('/blitzlesen.html');
});

app.get('/wortlisten', function (req, res) {
    loadWords(function (err, data) {
        if (err) {
            res.send(500, err);
        } else {
            res.json(data);
        }
    });
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

