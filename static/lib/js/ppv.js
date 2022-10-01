// $("#product_weight, #product_length, #product_width, #product_height").on("keypress keyup blur",function(event){if(event.which!=46&&event.which>31&&(event.which<48||event.which>57)){event.preventDefault()}});$("#product_weight, #product_length, #product_width, #product_height").focusout(e=>{val=$(e.target).val();if(!val){e.target.value=0}});if(elm.length){$.validator.addMethod("checkSa",function(value,element){if($(elm).select2("data").length<=0&&!$(cbaa).prop("checked")){return false}return true},"This Field is required.");$("#shipping_areas").rules("add",{checkSa:true});$.validator.addMethod("checkSm",function(value,element){if(value.length<=0&&!$("[data-custom-courier]").is(":checked")){return false}return true},"This Field is required.");$("#shipping_methods").rules("add",{checkSm:true});$("#custom_courier_fee").on("keypress keyup blur",function(e){$(this).val($(this).val().replace(/[^\d].+/,""));if(e.which<48||e.which>57){e.preventDefault()}})}$("#postal").on("keypress keyup blur",function(event){if(event.which<48||event.which>57){event.preventDefault()}});$.validator.addMethod("gt",function(value,element,param){return this.optional(element)||value>param},"Must be greater than 0.");$.validator.addMethod("checkPc",function(value,element){let b=!1;postURL("/v1/api/shipper/location-postal-v2",{postal:value.replace(/\s/g,"")}).done(function(e){document.getElementById("postal").value=value.replace(/\s/g,"");b=e.status!="fail"?!0:!1});return b},"Sorry, the postal code you entered was not found.");$.validator.addMethod("gt1",function(value,element,param){var a=$("#sale_price").val();if(a){return true}return this.optional(element)||value>param.v},"Must be greater than 0.");$.validator.addMethod("gt2",function(value,element,param){if(!value){value=0}if(value){$("[data-real-price] label.error").remove()}return this.optional(element)||value>param.v},"Must be greater than 0.");$("#product_weight").length&&$("#product_weight").rules("add",{gt:0});$("#product_length").length&&$("#product_length").rules("add",{gt:0});$("#product_width").length&&$("#product_width").rules("add",{gt:0});$("#product_height").length&&$("#product_height").rules("add",{gt:0});$("#postal").length&&$("#postal").rules("add",{required:true,checkPc:true});if($("input[name=product_type]").val()=="physical"){$("#base_price").length&&$("#base_price").rules("add",{gt1:{v:0}});$("#sale_price").length&&$("#sale_price").rules("add",{gt2:{v:0}})}const cpi=document.querySelector("[data-custom-price-input]");if(cpi&&cpi.checked){$("#base_price").length&&$("#base_price").rules("remove"," gt1");$("#sale_price").length&&$("#sale_price").rules("remove","gt2")}cpi&&cpi.addEventListener("change",e=>{if(e.target.checked){$("#base_price").length&&$("#base_price").rules("remove"," gt1");$("#sale_price").length&&$("#sale_price").rules("remove","gt2")}else{$("#base_price").length&&$("#base_price").rules("add",{gt1:{v:0}});$("#sale_price").length&&$("#sale_price").rules("add",{gt2:{v:0}})}});

$("#product_weight, #product_length, #product_width, #product_height").on("keypress keyup blur", function(event) {
    if (event.which != 46 && event.which > 31 && (event.which < 48 || event.which > 57)) {
        event.preventDefault()
    }
});
$("#product_weight, #product_length, #product_width, #product_height").focusout(e => {
    val = $(e.target).val();
    if (!val) {
        e.target.value = 0
    }
});
if (elm.length) {
    $.validator.addMethod("checkSa", function(value, element) {
        if ($(elm).select2("data").length <= 0 && !$(cbaa).prop("checked")) {
            return false
        }
        return true
    }, "This Field is required.");
    $("#shipping_areas").rules("add", {
        checkSa: true
    });
    $.validator.addMethod("checkSm", function(value, element) {
        if (value.length <= 0 && !$("[data-custom-courier]").is(":checked")) {
            return false
        }
        return true
    }, "This Field is required.");
    $("#shipping_methods").rules("add", {
        checkSm: true
    });
    $("#custom_courier_fee").on("keypress keyup blur", function(e) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if (e.which < 48 || e.which > 57) {
            e.preventDefault()
        }
    })
}
$("#postal").on("keypress keyup blur", function(event) {
    if (event.which < 48 || event.which > 57) {
        event.preventDefault()
    }
});
$.validator.addMethod("gt", function(value, element, param) {
    return this.optional(element) || value > param
}, "Must be greater than 0.");

$.validator.addMethod("checkPc", function(value, element) {
    let b = !1;
    postURL("/v1/api/shipper/location-postal-v2", {
        postal: value.replace(/\s/g, "")
    }).done(function(e) {
        document.getElementById("postal").value = value.replace(/\s/g, "");
        b = e.status != "fail" ? !0 : !1
    });
    return b
}, "Sorry, the postal code you entered was not found.");

$.validator.addMethod("gt1", function(value, element, param) {
    var a = $("#sale_price").val();
    if (a) {
        return true
    }
    return this.optional(element) || value > param.v
}, "Must be greater than 0.");
$.validator.addMethod("gt2", function(value, element, param) {
    if (!value) {
        value = 0
    }
    if (value) {
        $("[data-real-price] label.error").remove()
    }
    return this.optional(element) || value > param.v
}, "Must be greater than 0.");
$("#product_weight").length && $("#product_weight").rules("add", {
    gt: 0
});
$("#product_length").length && $("#product_length").rules("add", {
    gt: 0
});
$("#product_width").length && $("#product_width").rules("add", {
    gt: 0
});
$("#product_height").length && $("#product_height").rules("add", {
    gt: 0
});
$("#postal").length && $("#postal").rules("add", {
    required: true,
    checkPc: true
});
if ($("input[name=product_type]").val() == "physical") {
    $("#base_price").length && $("#base_price").rules("add", {
        gt1: {
            v: 0
        }
    });
    $("#sale_price").length && $("#sale_price").rules("add", {
        gt2: {
            v: 0
        }
    })
}
const cpi = document.querySelector("[data-custom-price-input]");
if (cpi && cpi.checked) {
    $("#base_price").length && $("#base_price").rules("remove", " gt1");
    $("#sale_price").length && $("#sale_price").rules("remove", "gt2")
}
cpi && cpi.addEventListener("change", e => {
    if (e.target.checked) {
        $("#base_price").length && $("#base_price").rules("remove", " gt1");
        $("#sale_price").length && $("#sale_price").rules("remove", "gt2")
    } else {
        $("#base_price").length && $("#base_price").rules("add", {
            gt1: {
                v: 0
            }
        });
        $("#sale_price").length && $("#sale_price").rules("add", {
            gt2: {
                v: 0
            }
        })
    }
});