const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./auth')

const authMiddleware = require('./auth/middleware');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var user = require('./routes/user');
var app = express();

//handlebars
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon());

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
  }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

//signup/login
app.use('/auth', auth);

//assurer que les user sont loggé
app.use('/user', authMiddleware.ensureLoggedIn, user);

//Static files (html, css, js) du site web : tout ce qui sera client-side donc dossier /public
app.use('/assets', express.static('public'))
app.use(express.static('public'));

 // Setup a default catch-all route
 // La catch-all route doit être après les static files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Require our routes into the application. Ça doit rester dans cet ordre...
require('./routes')(app);


/// error handlers

//Promise error handler -- requis sinon fait boguer l'app
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
    res.status(err.status || res.statusCode || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}    
    });
});

module.exports = app;
