var mysql = require('mysql');
const express = require('express'),
bodyParser = require('body-parser'),
path = require('path'),
ejs = require('ejs'),
expressLayouts = require('express-ejs-layouts')
var session = require('express-session');
const moment = require("moment");
var app = express()
var port = process.env.PORT || 9000
    
app.set('view engine', 'ejs')
app.set('layout', 'layout', 'user_layout');


app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
	resave: true,
	saveUninitialized: true
}));
app.use(expressLayouts)
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes'))

app.listen(port)
console.log(`Live on port ${port}`)
