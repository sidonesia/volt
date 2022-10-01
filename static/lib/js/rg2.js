var ag;
noescape();
var check_username = function (a) {
    var s = false;
    if (/^[\w.]+$/i.test(a) === false) {
        document.getElementById("msc").value = 1;
        document.getElementById("usernameHelp").innerHTML = 'Username may only contain letters, numbers, underscores ("_") and periods (".")';
        $("#usernameHelp").css("color", "red");
        $("#usernameHelp").parent().addClass("text-danger");
        $("#username").addClass("is-invalid");
        return s;
    }
    $.ajax({
        url: "/auth/users/" + a,
        cache: false,
        async: false,
        type: "GET",
        success: function (e) {
            message_code = e["message_code"];
            document.getElementById("msc").value = message_code;
            if (message_code == "1") {
                document.getElementById("usernameHelp").innerHTML = "The username '" + a + "' is already taken";
                $("#usernameHelp").css("color", "red");
                $("#usernameHelp").parent().addClass("text-danger");
                $("#username").addClass("is-invalid");
                s = false;
            } else {
                document.getElementById("usernameHelp").innerHTML = "";
                $("#usernameHelp").parent().removeClass("text-danger");
                $("#usernameHelp").parent().removeClass("is-invalid");
                $("#username").removeClass("is-invalid");
                s = true;
            }
        },
        error: function (e) {
            document.getElementById("alert-error").innerHTML = "We are sorry, but something went terribly wrong";
            s = false;
        },
    });
    return s;
};
var check_email = function (e) {
    var a = false;
    $.ajax({
        url: "/auth/emails/" + e,
        cache: false,
        async: false,
        type: "GET",
        success: function (e) {
            message_code = e["message_code"];
            document.getElementById("ems").value = message_code;
            if (message_code == "1") {
                document.getElementById("emailHelp").innerHTML = "Email is already taken";
                $("#emailHelp").css("color", "red");
                $("#emailHelp").parent().addClass("text-danger");
                $("#email").addClass("is-invalid");
                a = false;
            } else {
                document.getElementById("emailHelp").innerHTML = "";
                $("#emailHelp").parent().removeClass("text-danger");
                $("#emailHelp").parent().removeClass("is-invalid");
                $("#email").removeClass("is-invalid");
                a = true;
            }
        },
        error: function (e) {
            document.getElementById("alert-error").innerHTML = "We are sorry, but something went terribly wrong";
            a = false;
        },
    });
    return a;
};
var check_password = function (e) {
    var a = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
    if (!a.test(e)) {
        document.getElementById("pwdHelp").innerHTML = "Password must be at least 6 characters, must contain number, lowercase and uppercase letter.'";
        $("#pwdHelp").css("color", "red");
        $("#pwdHelp").parent().addClass("text-danger");
        $("#password").addClass("is-invalid");
        return false;
    } else {
        document.getElementById("pwdHelp").innerHTML = "";
        $("#pwdHelp").parent().removeClass("text-danger");
        $("#pwdHelp").parent().removeClass("is-invalid");
        $("#password").removeClass("is-invalid");
        return true;
    }
};
var check_confirm_password = function (e) {
    if (e != document.getElementById("password").value) {
        document.getElementById("pwdHelp1").innerHTML = "Password and Repeat Password fields must be the same";
        $("#pwdHelp1").css("color", "red");
        $("#pwdHelp1").parent().addClass("text-danger");
        $("#confirmpassword").addClass("is-invalid");
        return false;
    } else {
        document.getElementById("pwdHelp1").innerHTML = "";
        $("#pwdHelp1").parent().removeClass("text-danger");
        $("#pwdHelp1").parent().removeClass("is-invalid");
        $("#confirmpassword").removeClass("is-invalid");
        return true;
    }
};
var form_validate = function (e) {
    var a = document.getElementById("msc").value;
    var s = document.getElementById("ems").value;
    var n = check_username(document.getElementById("username").value);
    var t = check_password(document.getElementById("password").value);
    var r = check_confirm_password(document.getElementById("confirmpassword").value);
    var c = captcha.valid($('input[name="code"]').val());
    if (document.querySelector("#agree").checked) {
        ag = 1;
        document.getElementById("agreeHelp").innerHTML = "";
    } else {
        ag = !1;
        document.getElementById("agreeHelp").style.color = "red";
        document.getElementById("agreeHelp").style.fontSize = "12px";
        document.getElementById("agreeHelp").innerHTML = "Please check this box to indicate that you accept the Terms";
    }
    if (s == "1" || !n || !t || !r || !ag || !c) {
        e.preventDefault();
    }
};
