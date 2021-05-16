
var express = require('express')


var router = express.Router()



router.get('/', function(req, res, next) {
  
        res.render("user/main", {layout: "user_layout"});
    });
 
router.get('/register', function(req, res, next) {
        
        res.render("user/register", {layout: "user_layout"})
        
});
router.get('/login', function(req, res, next) {
    
      res.render("user/login", {layout: "user_layout"})
    
});




module.exports = router
