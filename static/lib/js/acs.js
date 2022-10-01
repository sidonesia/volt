$("#form").validate({
    ignore: "",
    onblur: true,
    onkeyup: false,
    onfocusout: function(element) {
        this.element(element)
    }
});
int($('[name="phone"]'));
$.validator.addMethod("ps", function(value, element) {
    if (!isphone(value)) {
        return false
    }
    return true
}, "Phone number is not valid.");
$("#phone").rules("add", {
    required: true,
    ps: true
});

function pnumber(t, e) {
    if (isphone(e.target.value)) {
        up(t, e)
    }
}

function up(t, e) {
    e.preventDefault();
    postURL("/v1/api/profile/update", serializedToJson(`[name="${e.target.name}"]`)).done(function(e) {
        showToastByX(t, t.name + " updated")
    }).fail(function(e) {
        showToastByX(t, "Whoops looks like something went wrong")
    })
}

function showToastByX(t, str) {
    var x = $(t).position();
    $(".toast-popup").css({
        top: "50%"
    });
    setTimeout(function() {
        $("#myToast").showToast({
            message: str,
            duration: 1e3,
            mode: "success"
        })
    }, 500)
}

function isphone(t) {
    return /^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(t)
}

function int(elm) {
    elm.on("keypress keyup blur", function(e) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if (e.which < 48 || e.which > 57) {
            e.preventDefault()
        }
    })
}

function serializedToJson(f) {
    let i = [];
    $.each($(f).serializeArray(), function() {
        if (i[this.name]) {
            if (!i[this.name].push) {
                i[this.name] = [i[this.name]]
            }
            i[this.name].push(this.value || "")
        } else {
            i[this.name] = this.value || ""
        }
    });
    return Object.assign({}, i)
}

// SHOW SHOP POLICY AND CONTACT INFORMATION
if( show_shop_policy == true ){
    document.getElementById("shop_policy").checked = true;
}

if( show_contact_info == true ){
    document.getElementById("contact_info").checked = true;
}

function onToggle(el) {
    var el_id       = el.id // field to update
    var is_show     = false
    var csrf_token  = document.getElementById("_csrf_token").value

    if (document.getElementById(el_id).checked) {
        is_show = true
    } else {
        is_show = false
    }

    var data = {
        "field"         : el_id,
        "is_show"       : is_show,
        "_csrf_token"   : csrf_token
    }


    $.ajax({
        type    : "POST",
        url     : "/process/account_info/toggle",
        data    : data,
        enctype : 'multipart/form-data'
    });

  }

// END SHOW SHOP POLICY AND CONTACT INFORMATION


