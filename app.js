const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var app = express();

//app.use(favicon());

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
  }
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

//Static files (html, css, js) du site web : tout ce qui sera client-side donc dossier /public
app.use(express.static('public'));
app.use('/assets', express.static('public'))

 // Setup a default catch-all route
 // La catch-all route doit être après les static files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));


// Require our routes into the application.
require('./routes')(app);

/// catch 404 and forwarding to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

/// error handlers

// development error handler
// will print stacktrace

//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.json({
//            message: err.message,
//            error: req.app.get('env') === 'development' ? err : {} 
        
//        });
//    });


module.exports = app;
