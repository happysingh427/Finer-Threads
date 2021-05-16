var mysql = require('mysql');
var express = require('express')
var md5 = require('md5'); 


var router = express.Router()

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecomm'
});



router.get('/', function(req, res, next) {
  
  var role_id = req.session.role_id
  const status = 1;
  var pro_list = `SELECT * FROM sub_catagary where status = ${status}`;
    connection.query(pro_list, function(err, rows, fields) {
        if (err) throw err;
        res.render("user/main", {role_id: role_id,product_list:rows,layout: "user_layout"})
    })
  
})


router.get('/login', function(req, res, next) {
  if(req.session.role_id == 1)
  {
    res.redirect('/admin');
  }else if(req.session.role_id == 2){
    res.redirect('/');
  }else{
    res.render("user/login", {layout: "user_layout"})
  }
})
router.post('/login', function(req,res,next){
  const { username, password } = req.body;
  const errors = [];
    connection.query('SELECT * FROM members WHERE email_id = ? AND password = MD5(?)', [username, password], function (err, result, fields) {
      if (err) {
          throw err;
          res.json({ status: "error", message: "An error has occurred. Please try again later" });
      } else {
        if (result.length == 0) {     
              errors.push("Wrong Username and Password");
              res.render("user/login", { message : errors, messageClass: 'alert-danger', username ,layout: "user_layout"});
        }else if(result[0].status == 0){
            errors.push("User deactive please contact support team");
            res.render("user/login", { message : errors, messageClass: 'alert-danger', username ,layout: "user_layout"});
        }else{
          if(result[0].role_id == 1)
          {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.first_name =  result[0].first_name;
            req.session.last_name =  result[0].last_name;
            req.session.uid =  result[0].id;
            req.session.role_id = result[0].role_id;
            res.redirect('/admin');
          }else{
            req.session.loggedin = true;
            req.session.username = username;
            req.session.first_name =  result[0].first_name;
            req.session.last_name =  result[0].last_name;
            req.session.uid =  result[0].id;
            req.session.role_id = result[0].role_id;
            res.redirect('/');
          }
        }
      }
  });
})
// Get loggout page
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
});

// register

router.get('/register', function(req, res, next) {
  if(req.session.role_id == 2){
    res.redirect('/');
  }else{
    res.render("user/register", {layout: "user_layout"})
  }
})

router.post('/register', function(req, res, next) {
  const { first_name,last_name,email,password,re_password } = req.body;
  const start = Date.now();
  var errors = [];
  var password1 = md5(password)
  var sql = `SELECT * FROM members WHERE email_id="${email}"`;
  connection.query(sql, function(err, rows, fields) {
    if(rows.length == 0)
    {
      var sql = `INSERT INTO members(first_name,last_name,email_id,password,added_date) VALUES ("${first_name}", "${last_name}","${email}","${password1}","${start}")`;
      connection.query(sql, function(err, result) {
        if (err) {
          throw err;
        }else{
         
          res.redirect("/");
        }
        
        
      }); 
    }else{
          errors.push("Email already Exits");
          res.render("user/register", { message : errors, messageClass: 'alert-danger',layout: "user_layout",first_name, last_name,email });
    }
  });
})




module.exports = router
