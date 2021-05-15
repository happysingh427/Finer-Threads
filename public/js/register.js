$(document).ready(function(){
    $.validator.addMethod("email_check", function(value, element) {
         return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
     });
     $("form[name='register']").validate({
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
             re_password:{
                 required:true,
                 equalTo:'[name="password"]'
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
            re_password:{
                required:"Confirm password is required"
            }
         },
         submitHandler: function(form) {
            form.submit();
        }
     });
 });