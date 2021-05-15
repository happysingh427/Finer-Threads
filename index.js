
const express = require('express'),
bodyParser = require('body-parser'),
path = require('path'),
ejs = require('ejs'),
expressLayouts = require('express-ejs-layouts')

var app = express()
var port = process.env.PORT || 9000
    
app.set('view engine', 'ejs')
app.set('layout', 'layout', 'user_layout');



app.use(expressLayouts)

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes'))

app.listen(port)
console.log(`Live on port ${port}`)
