var mysql = require('mysql');
var express = require('express')
var md5 = require('md5'); 
const multer = require("multer")
const Razorpay = require('razorpay');

var router = express.Router()

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecomm'
});

var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/uploads');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
});  

const instance = new Razorpay({
  key_id: 'rzp_test_4Ul7qSZnvkrOzc',
  key_secret: 'jlOs1tEEnlJ9ZNtUg5n6yl2w'
});

router.get('/admin', function(req, res, next) {
  if(req.session.role_id == 1)
  {
    var sql = `SELECT * FROM order_product`;
      connection.query(sql, function(err, rows, fields) {
        var total_ord = [];
        var total_panging_ord = [];
        if(rows.length > 0)
        {  
          for(var i=0; i< rows.length; i++){
              if(rows[i].ord_status == 1)
              {
                total_ord.push(rows);
              }else{
                total_panging_ord.push(rows);
              }
          }
        }
        var user = `SELECT * FROM members WHERE role_id = 2`;
        connection.query(user, function(err, users, fields) {
          var reg = [];
          if(users.length > 0)
          {
            for(var i=0; i< users.length; i++){
              if(users[i].status == 1)
              {
                reg.push(users);
              }
          }
          }
          var t_price = `SELECT SUM(total_price) as tot_price FROM payment`;
          connection.query(t_price, function(err, t_price, fields) {
            res.render("admin/home", {layout: "layout",activedash:'active',total_ord:total_ord.length,panding:total_panging_ord.length,reg:reg.length,t_price:t_price[0].tot_price})
          });
        });
      });
  }else{
    res.redirect('/login');
  }
  })
  router.get('/product-list', function(req, res, next) {
    if(req.session.role_id == 1){
      var sql = `SELECT pro.*,main.name,sub.c_name 
                    FROM products as pro 
                    LEFT JOIN main_catagary as main on main.id = pro.main_id
                    LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id`;
      connection.query(sql, function(err, rows, fields) {
        res.render("admin/product_list", {layout: "layout",title: 'Product List', product: rows,productlink:'active'})
      })
    }else{
      res.redirect('/login');
    }
  })
  
  router.get('/product-edit/:id',function(req, res, next){
    if(req.session.role_id == 1){
      var id = req.params.id;
       var sql = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
            FROM products as pro 
            LEFT JOIN (
              select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
              ) as stser ON stser.p_id = pro.id
            LEFT JOIN (
              select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
              ) as pco ON pco.p_id = pro.id
            LEFT JOIN main_catagary as main on main.id = pro.main_id
            LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.id = "${id}"`;
            connection.query(sql, function(err, rows, fields) {
              const status = 1;
              let sql4 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
              connection.query(sql4, function(err, main_cat, fields) {
                  if (err) throw err;
                  const status = 1;
                  let sql2 =  `SELECT id,size FROM size WHERE status = ${status}`;
                  connection.query(sql2, function(err, size, fields) {
                    let sql3 =  `SELECT id,color FROM color WHERE status = ${status}`;
                    connection.query(sql3, function(err, color, fields) {
                      res.render("admin/product_edit", {layout: "layout",m_cat:main_cat,size:size,color:color,product: rows,up_id:rows[0].id,title: 'Product Edit',productlink:'active'}) 
                    }) 
                  }) 
              })
             // res.render("admin/product_edit", {layout: "layout",title: 'Product Edit', product: rows,productlink:'active'})
            })
    }else{
      res.redirect('/login');
    }
  })
  
  router.post('/product-edit/:id',function(req,res,next){
    if(req.session.role_id == 1){
      var id = req.params.id;
      var profile_pic = '';
      const status = 1;
      let sql = `SELECT * FROM main_catagary WHERE status = "${status}"`;
      connection.query(sql, function(err, main_cat, fields) {
          if (err) throw err;
          const status = 1;
          let sql2 =  `SELECT id,size FROM size WHERE status = ${status}`;
          connection.query(sql2, function(err, size, fields) {
            let sql3 =  `SELECT id,color FROM color WHERE status = ${status}`;
            connection.query(sql3, function(err, color, fields) {
              var upload = multer({ storage : storage}).single('product_image');
                upload(req,res,function(err) { 
                   const { main_category,subid,sub_category,product_name,product_price,dis_price,product_quntity,pro_size,pro_color,description,pro_img } = req.body;
                    var errors = [];
                    if(pro_img == '')
                    {
                      var p_list = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                      FROM products as pro 
                      LEFT JOIN (
                        select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                          LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                        ) as stser ON stser.p_id = pro.id
                      LEFT JOIN (
                        select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                          LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                        ) as pco ON pco.p_id = pro.id
                      LEFT JOIN main_catagary as main on main.id = pro.main_id
                      LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.id = "${id}"`;
                      connection.query(p_list, function(err, rows, fields) {
                        errors.push("Product Image is required");
                        res.render("admin/product_edit", {message : errors, messageClass: 'alert-danger',layout: "layout",m_cat:main_cat,size:size,color:color,product: rows,up_id:rows[0].id,title: 'Product Edit',productlink:'active'}) 
                      })
                    }else{
                      if(req.file != null && typeof req.file == 'object') 
                      {
                        profile_pic = req.file.originalname;
                      }
                      if(profile_pic == '')
                      {
                        const { main_category,subid,sub_category,product_name,product_price,dis_price,product_quntity,pro_size,pro_color,description,pro_img } = req.body;
                        var up_query = `UPDATE products SET main_id="${main_category}",sub_id="${sub_category}",p_name="${product_name}",p_image="${pro_img}",p_price="${product_price}",dis_price="${dis_price}",p_quntity="${product_quntity}",description="${description}"  WHERE id="${id}"`;
                      }else{
                        const { main_category,subid,sub_category,product_name,product_price,dis_price,product_quntity,pro_size,pro_color,description,pro_img } = req.body;
                        var up_query = `UPDATE products SET main_id="${main_category}",sub_id="${sub_category}",p_name="${product_name}",p_image="${profile_pic}",p_price="${product_price}",dis_price="${dis_price}",p_quntity="${product_quntity}",description="${description}"  WHERE id="${id}"`;
                      }
                      connection.query(up_query, function(err, result, fields) {
                        if (err) throw err;
                        var p_list = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                                        FROM products as pro 
                                        LEFT JOIN (
                                          select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                                            LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                                          ) as stser ON stser.p_id = pro.id
                                        LEFT JOIN (
                                          select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                                            LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                                          ) as pco ON pco.p_id = pro.id
                                        LEFT JOIN main_catagary as main on main.id = pro.main_id
                                        LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.id = "${id}"`;
                              connection.query(p_list, function(err, rows, fields) {
                                if(rows.length == 1)
                                {
                                  var size_ids = rows[0].size_ids.split(',');
                                  var difference = pro_size.filter(x => !size_ids.includes(x)); //add
                                  var difference2 = size_ids.filter(x => !pro_size.includes(x)); //delete                                                                                              
                                  if(difference.length > 0)
                                  {
                                    for(i=0;i<difference.length;i++)
                                    {
                                      var add_sql2 = `INSERT INTO product_size(p_id,s_id) VALUES("${id}","${difference[i]}")`;
                                      connection.query(add_sql2, function(err, result) {
                                        if (err) throw err;
                                        console.log('insert success')
                                      })
                                    }
                                  }
                                  if(difference2.length > 0)
                                  {
                                    for(i=0;i<difference2.length;i++)
                                    {
                                      var del_sql2 = `DELETE FROM product_size WHERE p_id = ${id} AND s_id = ${difference2[i]}`;
                                      connection.query(del_sql2, function(err, result) {
                                        if (err) throw err;
                                        console.log('deleted success')
                                      })
                                    }
                                  }              
                                var color_ids = rows[0].color_ids.split(',');
                                var c_difference = pro_color.filter(x => !color_ids.includes(x)); //add
                                var c_difference2 = color_ids.filter(x => !pro_color.includes(x)); //delete    
                                if(c_difference.length > 0)
                                {
                                  for(i=0;i<c_difference.length;i++)
                                  {
                                    var add_sql2 = `INSERT INTO product_color(p_id,color_id) VALUES("${id}","${c_difference[i]}")`;
                                    connection.query(add_sql2, function(err, result) {
                                      if (err) throw err;
                                      console.log('insert success')
                                    })
                                  }
                                }
                                if(c_difference2.length > 0)
                                {
                                  for(i=0;i<c_difference2.length;i++)
                                  {
                                    var del_sql2 = `DELETE FROM product_color WHERE p_id = ${id} AND color_id = ${c_difference2[i]}`;
                                    connection.query(del_sql2, function(err, result) {
                                      if (err) throw err;
                                      console.log('deleted success')
                                    })
                                  }
                                }              
                              }
                              var pro_list = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                                  FROM products as pro 
                                  LEFT JOIN (
                                    select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                                      LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                                    ) as stser ON stser.p_id = pro.id
                                  LEFT JOIN (
                                    select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                                      LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                                    ) as pco ON pco.p_id = pro.id
                                  LEFT JOIN main_catagary as main on main.id = pro.main_id
                                  LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.id = "${id}"`;
                                  connection.query(pro_list, function(err, rows1, fields) {
                                    errors.push("Product Update Successfully");
                                    res.render("admin/product_edit", {message : errors, messageClass: 'alert-success',layout: "layout",m_cat:main_cat,size:size,color:color,product: rows1,up_id:rows1[0].id,title: 'Product Edit',productlink:'active'}) 
                                  })
                          });
                          
                      });
                    }
                })
            }) 
          }) 
      })
    }else{
      res.redirect('/login');
    }
  });
router.get('/changepassword', function(req,res,next){
    if(req.session.role_id == 1){
      res.render("admin/change_password", {layout: "layout",title: 'Change Password',settinglink:'active'}) 
    }else{
      res.redirect('/login');
    }
});
  
router.post('/changepassword', function(req,res,next){
    if(req.session.role_id == 1){
      var user_id = req.session.uid
      var errors = [];
      const {old_pass,new_pass,con_pass} = req.body;
      var password1 = md5(new_pass);
      var old_pass1 = md5(old_pass);
      var sql =  `SELECT * FROM members WHERE status=1 AND id=${user_id}`;
      connection.query(sql, function(err, rows, fields) {
        if(rows.length > 0)
        {
          if(old_pass1 == rows[0].password) 
          {
            var up_query = `UPDATE members SET password = "${password1}" WHERE status = 1 AND id=${user_id}`;
            connection.query(up_query, function(err, result, fields) {
              if (err) throw err;
              res.redirect('/logout');
            });
          }else{
            errors.push("Password Not Match");
            res.render("admin/change_password", {message : errors, messageClass: 'alert-danger',layout: "layout",title: 'Change Password',settingtlink:'active'})
          }
        }
      });
  
    }else{
      res.redirect('/login');
    }
  
});
router.get('/manage-profile',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id;
    var user_id = req.session.uid;
    const status = 1;
    var sql = `SELECT meb.*,coun.id as c_id,coun.name as cou_name,st.id as sid,st.name as st_name,ct.id as cid,ct.name as ct_name
    from members as meb
      left join countries as coun on coun.id = meb.country
      left join states as st on st.id = meb.state
      left join cities as ct on ct.id = meb.city
      where meb.id = "${user_id}"`;
      connection.query(sql, function(err, rows, fields) {
        var coun = `SELECT id,name FROM countries where flag = 1`;
        connection.query(coun, function(err, coun, fields) {
          if(rows.length == 1)
          {
            res.render("user/manage_profile", {role_id: role_id,country:coun,user_data:rows,layout: "user_layout"});
          }
        })
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/manage-profile',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id;
    var user_id = req.session.uid;
    const status = 1;
    var errors = [];
    var profile_pic = '';
    var upload = multer({ storage : storage}).single('profile_pic');
        upload(req,res,function(err) { 
          const { first_name,last_name,email,phone_no,old_img,country,state_id,state,city,zip_code,address } = req.body;
            if(req.file != null && typeof req.file == 'object') 
            {
              profile_pic = req.file.originalname;
            }
            if(profile_pic == '')
            {
              const { first_name,last_name,email,phone_no,old_img,country,state_id,state,city,zip_code,address } = req.body;
              var up_query = `UPDATE members SET first_name="${first_name}",last_name="${last_name}",email_id="${email}",phone_no="${phone_no}",profile_pic="${old_img}",address="${address}",city="${city}",state="${state}",country="${country}",zipcode="${zip_code}"  WHERE id="${user_id}"`;
            }else{
              const { first_name,last_name,email,phone_no,old_img,country,state_id,state,city,zip_code,address } = req.body;
              var up_query = `UPDATE members SET first_name="${first_name}",last_name="${last_name}",email_id="${email}",phone_no="${phone_no}",profile_pic="${profile_pic}",address="${address}",city="${city}",state="${state}",country="${country}",zipcode="${zip_code}"  WHERE id="${user_id}"`;
            }
            connection.query(up_query, function(err, result, fields) {
                if (err) throw err;
                var sql = `SELECT meb.*,coun.id as c_id,coun.name as cou_name,st.id as sid,st.name as st_name,ct.id as cid,ct.name as ct_name
                              from members as meb
                                left join countries as coun on coun.id = meb.country
                                left join states as st on st.id = meb.state
                                left join cities as ct on ct.id = meb.city
                                where meb.id = "${user_id}"`;
                connection.query(sql, function(err, rows, fields) {
                  var coun = `SELECT id,name FROM countries where flag = 1`;
                  connection.query(coun, function(err, coun, fields) {
                    if(rows.length == 1)
                    {
                      errors.push("Profile update successfully");
                      res.render("user/manage_profile", {role_id: role_id,country:coun,message : errors, messageClass: 'alert-success',up_id:rows[0].id,user_data:rows,layout: "user_layout" });
                    }
                  });
                });
            })
        });
  }else{
    res.redirect('/login');
  }
});


router.get('/change-password',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id;
    res.render("user/change_password", {role_id: role_id,layout: "user_layout"})
  }else{
    res.redirect('/login');
  }
});
router.post('/change-password',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id;
    var user_id = req.session.uid
    var errors = [];
    const {old_pass,new_pass,con_pass} = req.body;
    var password1 = md5(new_pass);
    var old_pass1 = md5(old_pass);
    var sql =  `SELECT * FROM members WHERE status=1 AND id=${user_id}`;
    connection.query(sql, function(err, rows, fields) {
      if(rows.length > 0)
      {
        if(old_pass1 == rows[0].password) 
        {
          var up_query = `UPDATE members SET password = "${password1}" WHERE status = 1 AND id=${user_id}`;
          connection.query(up_query, function(err, result, fields) {
            if (err) throw err;
            res.redirect('/logout');
          });
        }else{
          errors.push("Password Not Match");
          res.render("user/change_password", {role_id: role_id,message : errors, messageClass: 'alert-danger',layout: "user_layout",title: 'Change Password'})
        }
      }
    });
  }else{
    res.redirect('/login');
  }
});


router.get('/', function(req, res, next) {
  //if(req.session.role_id == 2)
  //{
  var role_id = req.session.role_id
  const status = 1;
  var pro_list = `SELECT * FROM sub_catagary where status = ${status}`;
    connection.query(pro_list, function(err, rows, fields) {
        if (err) throw err;
        res.render("user/main", {role_id: role_id,product_list:rows,layout: "user_layout"})
    })
  //}else{
    //res.redirect('/login');
  //}
})
router.get('/products',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id
    const status = 1;
    var sql = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                  FROM products as pro 
                  LEFT JOIN (
                    select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                      LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                    ) as stser ON stser.p_id = pro.id
                  LEFT JOIN (
                    select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                      LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                    ) as pco ON pco.p_id = pro.id
                  LEFT JOIN main_catagary as main on main.id = pro.main_id
                  LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.status = "${status}"`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.render("user/products", {role_id: role_id,product_list:rows,layout: "user_layout"})
    })
  }else{
    res.redirect('/login');
  }
})
router.post('/products',function(req,res,next){
  if(req.session.role_id == 2)
  {
    const {df_search,main_category,sub_category} = req.body
    var role_id = req.session.role_id
    const status = 1;
    var order_by = '';
    var swhere = '';
    if(df_search == '1')
    {
      order_by += `ORDER BY pro.id DESC`;
    }else if(df_search == '2')
    {
      order_by += `ORDER BY pro.p_price DESC`;
    }else if(df_search == '3')
    {
      order_by += `ORDER BY pro.p_price ASC`;
    }
    if(main_category != '')
    {
      if(swhere == '')
      {
        swhere += `WHERE pro.main_id = "${main_category}"`;
      }else{
        swhere += ` AND pro.main_id = "${main_category}"`;
      }
    }
    if(sub_category != '')
    {
      if(swhere == '')
      {
        swhere += `WHERE pro.sub_id = "${sub_category}"`;
      }else{
        swhere += ` AND pro.sub_id = "${sub_category}"`;
      }
    }
    if(swhere == '')
    {
      swhere += `WHERE pro.status = "${status}"`;
    }else{
      swhere += ` AND pro.status = "${status}"`;
    }
   
    var sql = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                  FROM products as pro 
                  LEFT JOIN (
                    select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                      LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                    ) as stser ON stser.p_id = pro.id
                  LEFT JOIN (
                    select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                      LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                    ) as pco ON pco.p_id = pro.id
                  LEFT JOIN main_catagary as main on main.id = pro.main_id
                  LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id ${swhere} ${order_by}`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.render("user/products", {role_id: role_id,product_list:rows,layout: "user_layout",df_search,main_category,sub_category})
    })
  }else{
    res.redirect('/login');
  }
})
router.get('/single-product/:id',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id
    var id = req.params.id;
    const status = 1;
    var sql = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                  FROM products as pro 
                  LEFT JOIN (
                    select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                      LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                    ) as stser ON stser.p_id = pro.id
                  LEFT JOIN (
                    select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                      LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                    ) as pco ON pco.p_id = pro.id
                  LEFT JOIN main_catagary as main on main.id = pro.main_id
                  LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.status = "${status}" AND pro.id = ${id}`;
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        var sql2 = `SELECT s.* FROM size as s 
                      left join product_size as ps on s.id = ps.s_id WHERE ps.p_id = ${id}`;
          connection.query(sql2, function(err, size, fields) {
            if (err) throw err;
            var sql3 = `SELECT c.* FROM color as c 
                      left join product_color as pc on c.id = pc.color_id WHERE pc.p_id = ${id}`;
            connection.query(sql3, function(err, color, fields) {
              if (err) throw err;
                res.render("user/single_product", {role_id: role_id,product_list:rows,size:size,color:color,layout: "user_layout"})
            })
          })
    })

  }else{
    res.redirect('/login');
  }
})
router.post('/single-product/:id',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id
    var u_id = req.session.uid;
    var id = req.params.id;
    var errors = [];
    const {quntity,size,color,p_id,p_price} = req.body;
    var total_price = quntity * p_price;
    const status = 1;
    var ins_cart = `INSERT INTO cart(user_id,p_id,size_id,color_id,quntity,price,total_price) VALUES("${u_id}","${p_id}","${size}","${color}","${quntity}","${p_price}","${total_price}")`;
    connection.query(ins_cart , function(err, result) {
      if (err) throw err;
    var sql = `SELECT pro.*,main.name,sub.c_name,stser.size_ids,pco.color_ids
                  FROM products as pro 
                  LEFT JOIN (
                    select psize.*,GROUP_CONCAT(s.size) as p_size, GROUP_CONCAT(s.id) as size_ids from product_size as psize
                      LEFT JOIN size as s on s.id = psize.s_id group by psize.p_id
                    ) as stser ON stser.p_id = pro.id
                  LEFT JOIN (
                    select pcolor.*,GROUP_CONCAT(s.color) as p_color, GROUP_CONCAT(s.id) as color_ids from product_color as pcolor
                      LEFT JOIN color as s on s.id = pcolor.color_id group by pcolor.p_id
                    ) as pco ON pco.p_id = pro.id
                  LEFT JOIN main_catagary as main on main.id = pro.main_id
                  LEFT JOIN sub_catagary as sub on sub.id = pro.sub_id WHERE pro.status = "${status}" AND pro.id = ${id}`;
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        var sql2 = `SELECT s.* FROM size as s 
                      left join product_size as ps on s.id = ps.s_id WHERE ps.p_id = ${id}`;
          connection.query(sql2, function(err, size, fields) {
            if (err) throw err;
            var sql3 = `SELECT c.* FROM color as c 
                      left join product_color as pc on c.id = pc.color_id WHERE pc.p_id = ${id}`;
            connection.query(sql3, function(err, color, fields) {
              if (err) throw err;
                errors.push("Product Add to cart sucessfully view cart");
                res.render("user/single_product", { message : errors, messageClass: 'alert-success',role_id: role_id,product_list:rows,size:size,color:color,layout: "user_layout"})
            })
          })
    })
  });
  }else{
    res.redirect('/login');
  }
})
router.get('/size-list', function(req, res, next) {
  if(req.session.role_id == 1){
    var sql = `SELECT * FROM size`;
    connection.query(sql, function(err, rows, fields) {
      res.render("admin/size_list", {layout: "layout",title: 'Size List', sizes: rows,sizelink:'active'})
    })
  }else{
    res.redirect('/login');
  }
})
router.get('/size-edit/:id', function(req, res, next) {
  if(req.session.role_id == 1){
    var id = req.params.id;
    var sql = `SELECT * FROM size where id="${id}"`;
    connection.query(sql, function(err, rows, fields) {
        if(rows.length == 1)
        {
          res.render("admin/size_edit", {size_data:rows,up_id:rows[0].id,layout: "layout",sizelink:'active' });
        }
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/size-edit/:id', function(req, res, next){
  if(req.session.role_id == 1){
    var id = req.params.id;
    var errors = [];
    const { size,description } = req.body
    var up_query = `UPDATE size SET size="${size}",description="${description}"  WHERE id="${id}"`;
    connection.query(up_query, function(err, result, fields) {
      if (err) throw err;
      var sql = `SELECT * FROM size where id="${id}"`;
      connection.query(sql, function(err, rows, fields) {
          if(rows.length == 1)
          {
            errors.push("Size update successfully");
            res.render("admin/size_edit", {message : errors, messageClass: 'alert-success',size_data:rows,up_id:rows[0].id,layout: "layout",sizelink:'active' });
          }
      })
    })
  }else{
    res.redirect('/login');
  }
})
router.post('/size-delete',function(req,res,next){
  var id = req.body.id;
  let sql = `DELETE FROM size WHERE id = ?`;
  connection.query(sql, id, (error, results, fields) => {
    if (error)
      return console.error(error.message);
      res.json({status:"1",message:"Delete Size successfully"})
    
  });
})

router.get('/size-add',function(req,res,next){
  if(req.session.role_id == 1){
      res.render("admin/size_add", {layout: "layout",title: 'Size Add',sizelink:'active'})   
  }else{
    res.redirect('/login');
  }
});

router.post('/size-add',function(req,res,next){

  if(req.session.role_id == 1){
    const { size,description } = req.body;
    var errors = [];
    var sql = `SELECT * FROM size WHERE size="${size}"`;
    connection.query(sql, function(err, rows, fields) {
      if(rows.length == 0)
      {
        var sql = `INSERT INTO size(size,description) VALUES ("${size}","${description}")`;
        connection.query(sql, function(err, result) {
          if (err) throw err;
            errors.push("Size add successfully");
            res.render("admin/size_add", { message : errors, messageClass: 'alert-success',layout: "layout",sizelink:'active'});
        }); 
      }else{
        errors.push("Size alredy exists");
        res.render("admin/size_add", { message : errors, messageClass: 'alert-danger',layout: "layout",sizelink:'active',size,description});
      }
    });
}else{
  res.redirect('/login');
}
})

router.get('/color-add',function(req,res,next){
  if(req.session.role_id == 1){
      res.render("admin/color_add", {layout: "layout",title: 'Color Add',colorlink:'active'})   
  }else{
    res.redirect('/login');
  }
});

router.post('/color-add',function(req,res,next){

  if(req.session.role_id == 1){
    const { c_name,color_picker,description } = req.body;
    var errors = [];
    var sql = `SELECT * FROM color WHERE color_code="${color_picker}"`;
    connection.query(sql, function(err, rows, fields) {
      if(rows.length == 0)
      {
        var sql = `INSERT INTO color(color,color_code,description) VALUES ("${c_name}","${color_picker}","${description}")`;
        connection.query(sql, function(err, result) {
          if (err) throw err;
            errors.push("Color add successfully");
            res.render("admin/color_add", { message : errors, messageClass: 'alert-success',layout: "layout",colorlink:'active'});
        }); 
      }else{
        errors.push("Color alredy exists");
        res.render("admin/color_add", { message : errors, messageClass: 'alert-danger',layout: "layout",colorlink:'active',c_name,color_picker,description});
      }
    });
}else{
  res.redirect('/login');
}
})

router.get('/color-list', function(req, res, next) {
  if(req.session.role_id == 1){
    var sql = `SELECT * FROM color`;
    connection.query(sql, function(err, rows, fields) {
      res.render("admin/color_list", {layout: "layout",title: 'Color List', colors: rows,colorlink:'active'})
    })
  }else{
    res.redirect('/login');
  }
})

router.get('/color-edit/:id', function(req, res, next) {
  if(req.session.role_id == 1){
    var id = req.params.id;
    var sql = `SELECT * FROM color where id="${id}"`;
    connection.query(sql, function(err, rows, fields) {
        if(rows.length == 1)
        {
          res.render("admin/color_edit", {color_data:rows,up_id:rows[0].id,layout: "layout",colorlink:'active' });
        }
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/color-edit/:id', function(req, res, next){
  if(req.session.role_id == 1){
    var id = req.params.id;
    var errors = [];
    const { c_name,color_picker,description } = req.body
    var up_query = `UPDATE color SET color="${c_name}",color_code="${color_picker}",description="${description}"  WHERE id="${id}"`;
    connection.query(up_query, function(err, result, fields) {
      if (err) throw err;
      var sql = `SELECT * FROM color where id="${id}"`;
      connection.query(sql, function(err, rows, fields) {
          if(rows.length == 1)
          {
            errors.push("Color update successfully");
            res.render("admin/color_edit", {message : errors, messageClass: 'alert-success',color_data:rows,up_id:rows[0].id,layout: "layout",colorlink:'active' });
          }
      })
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/color-delete',function(req,res,next){
  var id = req.body.id;
  let sql = `DELETE FROM color WHERE id = ?`;
  connection.query(sql, id, (error, results, fields) => {
    if (error)
      return console.error(error.message);
      res.json({status:"1",message:"Delete Color successfully"})
    
  });
})
// category

router.get('/category-add',function(req,res,next){
  if(req.session.role_id == 1){
    const status = 1;
    let sql = `SELECT * FROM main_catagary WHERE status = "${status}"`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.render("admin/category_add", {layout: "layout",m_cat:rows,title: 'Color Add',categorylink:'active'})   
    })
  }else{
    res.redirect('/login');
  }
});

router.post('/category-add',function(req,res,next){
  var upload = multer({ storage : storage}).single('c_image');
  upload(req,res,function(err) { 
    const { category,c_name,description } = req.body;
    var errors = [];
    var sql = `SELECT * FROM sub_catagary WHERE c_name="${c_name}"`;
    connection.query(sql, function(err, rows, fields) {
      if(rows.length == 0)
      {
        var sql = `INSERT INTO sub_catagary(main_id,c_name,c_image,c_description) VALUES ("${category}","${c_name}","${req.file.originalname}","${description}")`;
        connection.query(sql, function(err, result) {
          if (err) throw err;
          
          const status = 1;
          let sql1 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
          connection.query(sql1, function(err, rows, fields) {
            errors.push("Category add successfully");
            res.render("admin/category_add", { message : errors, messageClass: 'alert-success',m_cat:rows,layout: "layout",categorylink:'active'});
          })
        }); 
      }else{
          const status = 1;
          let sql1 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
          connection.query(sql1, function(err, rows, fields) {
            errors.push("Category already Exits");
            res.render("admin/category_add", { message : errors, messageClass: 'alert-danger',layout: "layout",m_cat:rows,category,c_name,description,categorylink:'active' });
          })
      }
    });
  })
})

router.get('/category-list', function(req, res, next) {
  if(req.session.role_id == 1){
    var sql = `SELECT sub.*,main.name 
                  FROM sub_catagary as sub LEFT JOIN main_catagary as main on main.id = sub.main_id`;
    connection.query(sql, function(err, rows, fields) {
      res.render("admin/category_list", {layout: "layout",title: 'Category List', category: rows,categorylink:'active'})
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/category-delete',function(req,res,next){
  var id = req.body.id;
  console.log(id);
  let sql = `DELETE FROM sub_catagary WHERE id = ?`;
  connection.query(sql, id, (error, results, fields) => {
    if (error)
      return console.error(error.message);
      res.json({status:"1",message:"Delete Category successfully"})
    
  });
});

router.get('/category-edit/:id', function(req, res, next) {
  if(req.session.role_id == 1){
    var id = req.params.id;
    var sql = `SELECT sub.*,main.name 
                  FROM sub_catagary as sub LEFT JOIN main_catagary as main on main.id = sub.main_id where sub.id="${id}"`;
    connection.query(sql, function(err, rows, fields) {
      if(rows.length == 1)
      {
        const status = 1;
        let sql1 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
        connection.query(sql1, function(err, results, fields) {
          res.render("admin/category_edit", {m_cat:results,category_data:rows,up_id:rows[0].id,layout: "layout",categorylink:'active' });
        });
      }
    })
  }else{
    res.redirect('/login');
  }
})

router.post('/category-edit/:id', function(req, res, next){
  if(req.session.role_id == 1){
    var id = req.params.id;
    var errors = [];
    var profile_pic='';
    var upload = multer({ storage : storage}).single('c_image');
    upload(req,res,function(err) { 
      const { category,c_name,description,old_img } = req.body;
      if(old_img == '')
      {
         var sql = `SELECT sub.*,main.name 
                      FROM sub_catagary as sub LEFT JOIN main_catagary as main on main.id = sub.main_id where sub.id="${id}"`;
        connection.query(sql, function(err, rows, fields) {
          if(rows.length == 1)
          {
            const status = 1;
            let sql1 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
            connection.query(sql1, function(err, results, fields) {
                errors.push("Category image is required");
                res.render("admin/category_edit", {message : errors, messageClass: 'alert-danger',m_cat:results,category_data:rows,up_id:rows[0].id,layout: "layout",categorylink:'active' });
            });
          }
        })
      }else{
          if(req.file != null && typeof req.file == 'object') 
            {
              profile_pic = req.file.originalname;
            }
            if(profile_pic == '')
            {
              const { category,c_name,description,old_img } = req.body;
              var up_query = `UPDATE sub_catagary SET main_id="${category}",c_name="${c_name}",c_image="${old_img}",c_description="${description}"  WHERE id="${id}"`;
            }else{
              const { category,c_name,description,old_img } = req.body;
              var up_query = `UPDATE sub_catagary SET main_id="${category}",c_name="${c_name}",c_image="${profile_pic}",c_description="${description}"  WHERE id="${id}"`;
            }
            connection.query(up_query, function(err, result, fields) {
              if (err) throw err;
              var sql = `SELECT sub.*,main.name 
                FROM sub_catagary as sub LEFT JOIN main_catagary as main on main.id = sub.main_id where sub.id="${id}"`;
                connection.query(sql, function(err, rows, fields) {
                  if(rows.length == 1)
                  {
                    const status = 1;
                    let sql1 = `SELECT * FROM main_catagary WHERE status = "${status}"`;
                    connection.query(sql1, function(err, results, fields) {
                      errors.push("Category update successfully");
                        res.render("admin/category_edit", {message : errors, messageClass: 'alert-success',m_cat:results,category_data:rows,up_id:rows[0].id,layout: "layout",categorylink:'active' });
                    });
                  }
                })             
          })
      }
    });

  }else{
    res.redirect('/login');
  }
})

router.get('/cart',function(req,res,next){
  if(req.session.role_id == 2)
  {
    var role_id = req.session.role_id;
    var u_id = req.session.uid;
    var car_list = `SELECT crt.*,pro.p_name,pro.p_image,pro.description,sz.size,col.color
                      from cart as crt
                      LEFT JOIN products as pro on pro.id = crt.p_id
                      LEFT JOIN size as sz on sz.id = crt.size_id
                      LEFT join color as col on col.id = crt.color_id
                      WHERE crt.user_id = ${u_id}`;
        connection.query(car_list, function(err, cart, fields) {
          if (err) throw err;
           var cart_total = `SELECT *,sum(total_price) as tot_price FROM cart where user_id = ${u_id}`;
           connection.query(cart_total, function(err, cart_total, fields) {
            if (err) throw err;
              res.render("user/cart", {role_id: role_id,cart:cart,cart_total:cart_total,layout: "user_layout"})
           })
        })
  }else{
    res.redirect('/login');
  }
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
        if (err) throw err;
        /*req.session.loggedin = true;
        req.session.username = email;
        req.session.first_name = first_name;
        req.session.last_name =  last_name;
        req.session.uid = result.insertId;
        req.session.role_id = 2;
        res.redirect('/');*/
        //errors.push("Email already Exits");
          res.redirect("/");
      }); 
    }else{
          errors.push("Email already Exits");
          res.render("user/register", { message : errors, messageClass: 'alert-danger',layout: "user_layout",first_name, last_name,email });
    }
  });
})









module.exports = router
