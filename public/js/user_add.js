$(document).ready(function(){
    $.validator.addMethod("email_check", function(value, element) {
         return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
     });
     $("form[name='user_add']").validate({
         errorClass: 'errors',
         rules:{
            first_name:{
                required:true
            },
            last_name:{
                required:true
            },
             email:{
                 required:true,
                 email:true,
                 email_check:true
             },
             password:{
                 required:true
             },
             cpassword:{
                 required:true,
                 equalTo:'[name="password"]'
             },
             profile_pic:{
                 required:true
             },
             country:{
                 required:true
             },
             states:{
                 required:true
             },
             city:{
                 required:true
             },
             zip_code:{
                 required:true
             },
             address:{
                 required:true
             },
             phone_no:{
                 minlength:10,
                 maxlength:13
             }
         },
         messages:{
            first_name:{
                required:"Please Enter First Name"
            },
            last_name:{
                required:"Please Enter Last Name"
            },
            email:{
                 required:"please enter Email",
                 email_check:"Enter valid email address"
            },
            password:{
                 required:"password is required"
            },
            cpassword:{
                required:"Confirm password is required"
            },
            profile_pic:{
                required:"Profile Pic is required"
            },
            country:{
                required:"Country field is required"
            },
            states:{
                required:"State field is required"
            },
            city:{
                required:"City field is required"
            },
            zip_code:{
                required:"Zip code field is required"
            },
            address:{
                required:"Address field is required"
            }
         },
         submitHandler: function(form) {
            form.submit();
        }
     });
     $("form[name='user_edit']").validate({
        errorClass: 'errors',
        rules:{
           first_name:{
               required:true
           },
           last_name:{
               required:true
           },
            email:{
                required:true,
                email:true,
                email_check:true
            },
            password:{
                required:true
            },
            cpassword:{
                required:true,
                equalTo:'[name="password"]'
            },
            country:{
                required:true
            },
            states:{
                required:true
            },
            city:{
                required:true
            },
            zip_code:{
                required:true
            },
            address:{
                required:true
            },
            phone_no:{
                minlength:10,
                maxlength:13
            }
        },
        messages:{
           first_name:{
               required:"Please Enter First Name"
           },
           last_name:{
               required:"Please Enter Last Name"
           },
           email:{
                required:"please enter Email",
                email_check:"Enter valid email address"
           },
           password:{
                required:"password is required"
           },
           cpassword:{
               required:"Confirm password is required"
           },
           country:{
               required:"Country field is required"
           },
           states:{
               required:"State field is required"
           },
           city:{
               required:"City field is required"
           },
           zip_code:{
               required:"Zip code field is required"
           },
           address:{
               required:"Address field is required"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='size_add']").validate({
        errorClass: 'errors',
        rules:{
           size:{
               required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           size:{
               required:"Please Enter Size"
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='size_edit']").validate({
        errorClass: 'errors',
        rules:{
           size:{
               required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           size:{
               required:"Please Enter Size"
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='color_add']").validate({
        errorClass: 'errors',
        rules:{
           c_name:{
               required:true
           },
           color_picker:{
                required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           c_name:{
               required:"Please Enter Color name"
           },
           color_picker:{
               required:'please select color'
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='color_edit']").validate({
        errorClass: 'errors',
        rules:{
           c_name:{
               required:true
           },
           color_picker:{
                required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           c_name:{
               required:"Please Enter Color name"
           },
           color_picker:{
               required:'please select color'
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='category_add']").validate({
        errorClass: 'errors',
        rules:{
           c_name:{
               required:true
           },
           c_image:{
                required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           c_name:{
               required:"Please Enter Cetegory name"
           },
           c_image:{
               required:'please select image'
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
     $("form[name='category_edit']").validate({
        errorClass: 'errors',
        rules:{
           c_name:{
               required:true
           },
           description:{
               required:true
           }
        },
        messages:{
           c_name:{
               required:"Please Enter Cetegory name"
           },
           description:{
               required:"Please Enter Description"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });

    $("form[name='product_add']").validate({
        ignor:[],
        errorClass: 'errors',
        rules:{
            main_category:{
                required:true
            },
            sub_category:{
                required:true
            },
           product_name:{
               required:true
           },
           product_price:{
               required:true
           },
           product_quntity:{
                required:true
           },
           product_color:{
               required:true
           },
           product_size:{
               required:true
           },
           description:{
               required:true
           },
           product_image:{
               required:true
           }
        },
        messages:{
            main_category:{
               required:"Main category field is required"
           },
           sub_category:{
               required:'Sub category field is required'
           },
           product_name:{
               required:"Product Name is required"
           },
           product_price:{
               required:"Product price is required"
           },
           product_quntity:{
               required:"Product quntity is required"
           },
           product_color:{
               required:"Product color is required"
           },
           product_color:{
               required:"Product color is required"
           },
           product_size:{
               required:"Product size is required"
           },
           description:{
               required:"Description is required"
           },
           product_image:{
               required:"Product image is required"
           },
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
    $("form[name='product_edit']").validate({
        ignor:[],
        errorClass: 'errors',
        rules:{
            main_category:{
                required:true
            },
            sub_category:{
                required:true
            },
           product_name:{
               required:true
           },
           product_price:{
               required:true
           },
           product_quntity:{
                required:true
           },
           product_color:{
               required:true
           },
           product_size:{
               required:true
           },
           description:{
               required:true
           }
        },
        messages:{
            main_category:{
               required:"Main category field is required"
           },
           sub_category:{
               required:'Sub category field is required'
           },
           product_name:{
               required:"Product Name is required"
           },
           product_price:{
               required:"Product price is required"
           },
           product_quntity:{
               required:"Product quntity is required"
           },
           product_color:{
               required:"Product color is required"
           },
           product_color:{
               required:"Product color is required"
           },
           product_size:{
               required:"Product size is required"
           },
           description:{
               required:"Description is required"
           }
        },
        submitHandler: function(form) {
           form.submit();
       }
    });
 });