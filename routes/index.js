// var mysql = require('mysql');
var express = require('express')
// var md5 = require('md5'); 
// const multer = require("multer")

var router = express.Router()



router.get('/', function(req, res, next) {
  
        res.render("user/main", {layout: "user_layout"});
    });
 


module.exports = router
