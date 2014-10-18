var path = require('path');
var fs = require('fs');
var events = require('events');
var util = require('util');
var http = require('http');
var express = require('express');
var notemplate = require('express-notemplate');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/uploads' }));
    app.use(express.methodOverride());
    app.use(express.cookieParser('blikdiblu'));
    app.use(express.session());
    app.use(app.router);
    app.set('statics', process.cwd() + '/public');
    app.engine('html', notemplate.__express);
    app.set('view engine', 'html');
    app.use(express.static(app.get('statics')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

var server = http.createServer(app);
app.get('/', function (req, res) {
    res.redirect('/blitzlesen.html');
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

