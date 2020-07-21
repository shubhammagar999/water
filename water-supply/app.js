var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
// var nodemailer = require('nodemailer');

var oauth = require('./oauth');
var routes = require('./routes/index');
var login = require('./routes/login');
var company = require('./routes/company');
var vendor = require('./routes/vendor');
var customer = require('./routes/customer');
var employee = require('./routes/employee');
var unit = require('./routes/unit');
var product = require('./routes/product');
var purchase = require('./routes/purchase');
var purchasereturn = require('./routes/purchasereturn');
var expense = require('./routes/expense');
var purexpense = require('./routes/purexpense');
var expensetype = require('./routes/expensetype');
var dailyexpense = require('./routes/dailyexpense');
var sale = require('./routes/sale');
var bank = require('./routes/bank');
var cash = require('./routes/cash');
var cashtransfer = require('./routes/cashtransfer');
var bankwithdraw = require('./routes/bankwithdraw');


var salereturn = require('./routes/salereturn');
var dashboard = require('./routes/dashboard');
var user = require('./routes/user');
var sms = require('./routes/sms');
var emailsent = require('./routes/emailsent');
var backup = require('./routes/backup');

var workshop = require('./routes/workshop');
var workshopsale = require('./routes/workshopsale');


var pmx = require('pmx').init({
  http          : true, // HTTP routes logging (default: true)
  ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors        : true, // Exceptions loggin (default: true)
  custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network       : true, // Network monitoring at the application level
  ports         : true  // Shows which ports your app is listening on (default: false)
});
// var connectionString = process.env.DATABASE_URL || 'postgres://postgres:zeartech@localhost:5432/citymotors';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve static filesw
// app.use('/',express.static('views/citymotors'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// OAuth2 Server
app.oauth = oauth;
app.all('/oauth/token', app.oauth.grant());
app.use(app.oauth.errorHandler());

// Define Routes Here
// app.use('/', routes);
app.use('/login', login);
app.use('/company', company);
app.use('/vendor', vendor);
app.use('/customer', customer);
app.use('/employee', employee);
app.use('/unit', unit);
app.use('/product', product);
app.use('/purchase', purchase);
app.use('/purchasereturn', purchasereturn);
app.use('/expense', expense);
app.use('/purexpense', purexpense);
app.use('/expensetype', expensetype);
app.use('/dailyexpense', dailyexpense);
app.use('/sale', sale);
app.use('/bank', bank);
app.use('/cash', cash);
app.use('/cashtransfer', cashtransfer);
app.use('/bankwithdraw', bankwithdraw);


app.use('/salereturn', salereturn);
app.use('/dashboard', dashboard);
app.use('/sms', sms);
app.use('/emailsent', emailsent);
app.use('/backup', backup);
app.use('/user', user);

app.use('/workshop', workshop);
app.use('/workshopsale', workshopsale);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // secure:true for port 465, secure:false for port 587
//     auth: {
//         user: 'raees.shaikh241@gmail.com',
//         pass: 'a1b2c3d4$'
//     }
// });

// // setup email data with unicode symbols
// let mailOptions = {
//     from: '"Raees Shaikh" <raees.shaikh241@gmail.com>', // sender address
//     to: 'raees@zeartech.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world ?', // plain text body
//     html: '<b>Hello world ?</b>' // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log(error);
//     }
//     console.log('Message %s sent: %s', info.messageId, info.response);
// });

// error handlers

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
