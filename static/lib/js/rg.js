
var check_username = function(username) {
  $.ajax({
    url: '/auth/users/' + username,
    processData : false,
    contentType : false,
    type: 'GET',
    success: function(e){
      message_code = e['message_code']
      document.getElementById("msc").value = message_code
      if (message_code == "1" ) {
        document.getElementById("usernameHelp").innerHTML = "The username '" + username + "' is already taken"
        $("#usernameHelp").css("color", "red")
        $('#usernameHelp').parent().addClass("text-danger");
        $('#username').addClass("is-invalid");
      }else {
        document.getElementById("usernameHelp").innerHTML = ""
        $('#usernameHelp').parent().removeClass("text-danger");
        $('#usernameHelp').parent().removeClass("is-invalid");
        $('#username').removeClass("is-invalid");
      }
    }
  })
}

check_username(document.getElementById("username").value)

$('#form-registration').submit(function (event) {
  var msc = document.getElementById("msc").value;
  if (msc == "1") {
    event.preventDefault()
  }
});

$('#username').focusout((e)=>{
  var username = document.getElementById("username").value;
  if (username) {
    check_username(username)
  } else {
    document.getElementById("usernameHelp").innerHTML = ""
  }
});

$('#email').focusout((e)=>{
  var email = document.getElementById("email").value;
  if (email) {
    $.ajax({
      url: '/auth/emails/' + email,
      processData : false,
      contentType : false,
      type: 'GET',
      success: function(e){
        message_code = e['message_code']
        document.getElementById("msc").value = message_code
        if (message_code == "1" ) {
          document.getElementById("emailHelp").innerHTML = "Email is already taken"
          $("#emailHelp").css("color", "red")
          $('#emailHelp').parent().addClass("text-danger");
          $('#email').addClass("is-invalid");
        }else {
          document.getElementById("emailHelp").innerHTML = ""
          $('#emailHelp').parent().removeClass("text-danger");
          $('#emailHelp').parent().removeClass("is-invalid");
          $('#email').removeClass("is-invalid");
        }
      }
    })
  } else {
    document.getElementById("emailHelp").innerHTML = ""
  }
});

jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
}, '');

jQuery.validator.addMethod("password_combination", function(value, element) {
  return this.optional(element) || (value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/));
}, '');

$('#form-registration').validate({
  onblur: true,
  onkeyup: false,
  onfocusout: function(element) {
    this.element(element);
  },
  rules: {
      "email": {
        required: true,
      },
      "username": {
        required: true,
        alphanumeric: true
      },
      "password": { 
        required: true,
        minlength: 6,
        password_combination: true
      },
      "confirmpassword" : {
          minlength : 6,
          equalTo : "#password"
      }
  },
  messages: {
      "email": {
        required: "Email is required",
      },
      "username": {
        required: "Username is required",
        alphanumeric: 'Username may only contain letters, numbers, underscores ("_") and periods (".")'
      },
      "password": {
        required: "Password is required",
        minlength: "Password must be at least 6 characters",
        password_combination: 'Password must contain number, lowercase and uppercase letter.'
      },            
      "confirmpassword" : {
          equalTo : "Password and Repeat Password fields must be the same"
      }
  },

  invalidHandler: function(form, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
          $("html, body").animate({
              scrollTop: $(validator.errorList[0].element).offset().top-500
          }, 500);
      }
  }
});