var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var Users = require('./routes/Users');
var Passwords = require('./routes/Passwords');
var Content = require('./routes/Content');
var Images = require('./routes/Images');
var Writers = require('./routes/Writers');
var CraftSessions = require('./routes/CraftSessions');
var Readings = require('./routes/Readings');
var Workshops = require('./routes/Workshops');
var Sponsors = require('./routes/Sponsors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/Users', Users);
app.use('/Passwords', Passwords);
app.use('/Content', Content);
app.use('/Images', Images);
app.use('/Writers', Writers);
app.use('/CraftSessions', CraftSessions);
app.use('/Readings', Readings);
app.use('/Workshops', Workshops);
app.use('/Sponsors', Sponsors);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
