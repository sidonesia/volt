const default_method = "OV";
const no_min_list = ["GP", "OV", "SA", "SP"];
const reqMsg = "This field is required";
var pe, pn, pp, pq, ag, qs, io;
var actionStatus;
var uuid;

const palButton = paypal.Buttons({
    style: { label: "checkout", size: "medium", shape: "rect", color: "blue" },
    onInit: function (data, actions) {
        io = !1;
        actions.disable();
        document.querySelector("#payer_email").addEventListener("focusout", function (event) {
            if (event.target.value) {
                pe = 1;
                if (validateEmail(event.target.value)) {
                    pe = 1;
                    document.getElementById("msg").innerText = "";
                    document.getElementById("msg").style.display = "none";
                } else {
                    document.getElementById("msg").innerText = "Please enter a valid email address";
                    document.getElementById("msg").style.display = "block";
                    pe = !1;
                }
            } else {
                document.getElementById("msg").innerText = reqMsg;
                document.getElementById("msg").style.display = "block";
                pe = !1;
            }
        });
        document.querySelector("#payer_name") &&
            document.querySelector("#payer_name").addEventListener("focusout", function (event) {
                if (event.target.required) {
                    if (event.target.value) {
                        pn = 1;
                        document.getElementById("nameHelp").innerHTML = "";
                    } else {
                        pn = !1;
                        document.getElementById("nameHelp").style.fontSize = "12px";
                        document.getElementById("nameHelp").innerHTML = reqMsg;
                    }
                } else {
                    pn = 1;
                }
            });
        document.querySelector("#payer_phone") &&
            document.querySelector("#payer_phone").addEventListener("focusout", function (event) {
                if (event.target.required) {
                    if (event.target.value) {
                        pp = 1;
                        document.getElementById("phoneHelp").innerHTML = "";
                    } else {
                        pp = !1;
                        document.getElementById("phoneHelp").style.fontSize = "12px";
                        document.getElementById("phoneHelp").innerHTML = reqMsg;
                    }
                } else {
                    pp = 1;
                }
            });
        var checkbox = document.querySelector("#agree");
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                ag = 1;
                document.getElementById("agreeHelp").innerHTML = "";
            } else {
                ag = !1;
                document.getElementById("agreeHelp").style.fontSize = "12px";
                document.getElementById("agreeHelp").innerHTML = "Please check this box to indicate that you accept the Terms";
            }
        });
        $(document).on("focusout", ".qshort", function () {
            var val = $(this).val();
            var _id = $(this).attr("id");
            var isReq = $(this).prop("required");
            if (isReq && !val) {
                $("label.error").hide();
                document.getElementById(_id + "_Help").innerHTML = reqMsg;
            } else {
                document.getElementById(_id + "_Help").innerHTML = "";
            }
        });
        actionStatus = actions;
    },
    onClick: function () {
        onClickValidate();
        pe && pn && pp && pq && ag && qs ? actionStatus.enable() : actionStatus.disable();
    },
    createOrder: function (data, actions) {
        crTemp();
        if (io) {
            const billed_amount = (get_exch(parseFloat(pr)) + get_exch(get_fee(pr, 'PP')) + get_exch(parseFloat(sf))).toFixed(2);
            return actions.order.create({ purchase_units: [{ reference_id: uuid, amount: { currency_code: "USD", value: billed_amount } }] });
        }
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            $.each($("#form_checkout").serializeArray(), function () {
                if (details[this.name]) {
                    if (!details[this.name].push) {
                        details[this.name] = [details[this.name]];
                    }
                    details[this.name].push(this.value || "");
                } else {
                    details[this.name] = this.value || "";
                }
            });
            (details.pid = document.querySelector("#pid").value),
                (details.billed_amount = $("#billed_amount_tag").text().split(" ")[1]),
                (details.price = $("#price_tag").text().split(" ")[1]),
                (details.con_fee_usd = $("#convenience_fee_tag").text().split(" ")[1]),
                (details.price_idr = document.getElementById("price").value),
                (details.convenience_fee = document.getElementById("convenience_fee").value),
                (details.qty = 1),
                (details.tz = document.getElementById("tz").value),
                (details.r_uri = document.getElementById("r_uri").value),
                (details.iana = document.getElementById("iana").value),
                (details.payer_email = document.getElementById("payer_email").value),
                received_callback(details);
        });
    },
    onCancel: function (data) {
        actionStatus.disable();
        (data.status = "CANCELLED"), (data.payer_email = document.getElementById("payer_email").value), (data.tz = document.getElementById("tz").value), (data.iana = document.getElementById("iana").value), received_callback(data);
    },
});

palButton.render("#paypal-container");
function crTemp() {
    var details = serializedToJson("#form_checkout");
    details.zip  = gg;
    details.pid = document.querySelector("#pid").value;
    details.billed_amount = $("#billed_amount_tag").text().split(" ")[1];
    details.price = $("#price_tag").text().split(" ")[1];
    details.con_fee_usd = $("#convenience_fee_tag").text().split(" ")[1];
    details.price_idr = document.getElementById("price").value;
    details.convenience_fee = document.getElementById("convenience_fee").value;
    details.qty = 1;
    details.tz = document.getElementById("tz").value;
    details.r_uri = document.getElementById("r_uri").value;
    details.iana = document.getElementById("iana").value;
    details.payer_email = document.getElementById("payer_email").value;
    details.uuid = uuid;
    var r = postURL("/v1/api/orders/init", details)
        .done(function (e) {
            io = 1;
            uuid = e.uuid;
        })
        .fail(function (e) {
            io = !1;
        });
}

function serializedToJson(f) {
    let i = [];
    $.each($(f).serializeArray(), function () {
        if (i[this.name]) {
            if (!i[this.name].push) {
                i[this.name] = [i[this.name]];
            }
            i[this.name].push(this.value || "");
        } else {
            i[this.name] = this.value || "";
        }
    });
    return Object.assign({}, i);
}

function onClickValidate() {
    var i = 0;
    var ids = [];
    $(".qshort").each(function () {
        var val = $(this).val();
        var _id = $(this).attr("id");
        var isReq = $(this).prop("required");
        if (isReq && !val) {
            ids[i++] = _id;
            document.getElementById(_id + "_Help").innerHTML = reqMsg;
        } else {
            document.getElementById(_id + "_Help").innerHTML = "";
        }
    });
    if (ids.length > 0) {
        qs = !1;
    } else {
        qs = 1;
    }
    if (document.querySelector("#agree").checked) {
        ag = 1;
        document.getElementById("agreeHelp").innerHTML = "";
    } else {
        ag = !1;
        document.getElementById("agreeHelp").style.fontSize = "12px";
        document.getElementById("agreeHelp").innerHTML = "Please check this box to indicate that you accept the Terms";
    }
    payer_name = document.getElementById("payer_name");
    if (payer_name && payer_name.required) {
        if (!payer_name.value) {
            pn = !1;
            document.getElementById("nameHelp").style.fontSize = "12px";
            document.getElementById("nameHelp").innerHTML = reqMsg;
        } else {
            pn = 1;
            document.getElementById("nameHelp").innerHTML = "";
        }
    } else {
        pn = 1;
    }
    payer_phone = document.getElementById("payer_phone");
    if (payer_phone && payer_phone.required) {
        if (!payer_phone.value) {
            pp = !1;
            document.getElementById("phoneHelp").style.fontSize = "12px";
            document.getElementById("phoneHelp").innerHTML = reqMsg;
        } else {
            pp = 1;
            document.getElementById("phoneHelp").innerHTML = "";
        }
    } else {
        pp = 1;
    }
    if (document.querySelector("#payer_email").value) {
        pe = 1;
        if (validateEmail(document.querySelector("#payer_email").value)) {
            pe = 1;
            document.getElementById("msg").innerText = "";
        } else {
            document.getElementById("msg").innerText = "Please enter a valid email address";
            pe = !1;
        }
    } else {
        document.getElementById("msg").innerText = reqMsg;
        pe = !1;
    }
    if (document.querySelector('input[id="radios"]') && $("#question").data().required) {
        null == document.querySelector('input[id="radios"]:checked') ? ((pq = !1), (document.getElementById("questionHelp").innerHTML = reqMsg)) : (pq = 1);
        var other = document.querySelector('input[id="radios"]:checked');
        if (other && !other.value) {
            if (document.getElementsByName(other.name.split("-")[1])[0].value) {
                document.getElementById("questionHelp").innerHTML = "";
                pq = 1;
            } else {
                document.getElementById("questionHelp").innerHTML = reqMsg;
                pq = !1;
            }
        }
    } else {
        pq = 1;
    }
}

function eClick() {
    document.querySelector(".mtc").classList.toggle("show");
}
function agreed() {
    const buyBtn = document.querySelector("#button-container button");
    buyBtn.toggleAttribute("disabled"), buyBtn.classList.toggle("Bgc(#707070)"), buyBtn.classList.toggle("Pe(n)");
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateForm(e) {
    const u = $('input[name=payment_method]:checked').length;
    if (u==0 && am>0) {
        alert("Please select a payment method !");
        e.preventDefault();
    } else {
        document.getElementById("zip").value  = gg;
        var data;
        if (document.querySelector('input[id="radios"]') && $("#question").data().required) {
            null == document.querySelector('input[id="radios"]:checked') && (e.preventDefault(), (document.getElementById("questionHelp").innerHTML = reqMsg));
            var other = document.querySelector('input[id="radios"]:checked'),
                x;
            if (other && !other.value)
                document.getElementsByName(other.name.split("-")[1])[0].value ? (document.getElementById("questionHelp").innerHTML = "") : (e.preventDefault(), (document.getElementById("questionHelp").innerHTML = reqMsg));
        }
        cekFormBeforeSubmit(e);
   
        if (!(pe && pn && pp && pq && ag && qs)) {
            e.preventDefault();
        }
    }
}

function checkedQuestion(e) {
    e.value && document.getElementsByName(e.name.split("-")[1])[0] && (document.getElementsByName(e.name.split("-")[1])[0].value = ""), (document.getElementById("questionHelp").innerHTML = "");
}
function handleQuestionInputfOut(e) {
    var data = $("#question").data();
    !e.value && data.required ? (document.getElementById("questionHelp").innerHTML = reqMsg) : (document.getElementById("questionHelp").innerHTML = "");
}
function handleQuestionInputfIn(e) {
    $(e).closest(".ccrb").find(":radio").prop("checked", !0);
}
noescape();

var cekFormBeforeSubmit = function (e) {
    const max_pay_exceed = getU("/v1/api/payments/max-exceed-payment-list").message_data;
    const pm_checked_val = $("input[name='payment_method']:checked").val();
    const billed_amount = document.getElementById("billed_amount");
    const min_payment = 1e4;
    cek(pm_checked_val);
    setTz();
    if (max_pay_exceed[pm_checked_val]) {
        if (billed_amount.value > max_pay_exceed[pm_checked_val]) {
            alert("Max transaction amount Rp " + max_pay_exceed[pm_checked_val] + ", please select other method !");
            $("input[name=payment_method][value=" + default_method + "]").prop("checked", true);
            e.preventDefault();
        }
    }
    if (document.getElementById("billed_amount").value > 0 && document.getElementById("billed_amount").value < min_payment && !no_min_list.includes(payment_method)) {
        alert("Minimum Payment " + min_payment);
        e.preventDefault();
    }
    onClickValidate();
};

function cek(e) {
   
    const price = document.getElementById("price").value;
    const amount = document.querySelector("#amount");
    let IDR = document.getElementById("amount").value;
    setTz();
    if (e == "PP") {
        let admin_fee = get_fee(price, "PP");
        let price_usd = get_exch(price);
        let fee_usd = get_exch(admin_fee);
        let total_usd = (price_usd + fee_usd).toFixed(2);
        $("#price_tag").text(`USD ${price_usd}`);
        $("#billed_amount").attr("value", `${total_usd}`);
        $("#convenience_fee").attr("value", `${admin_fee}`);
        $("#convenience_fee_tag").text(`USD ${fee_usd}`);
        $("#billed_amount_tag").text(`USD ${total_usd}`);
        document.getElementById("paypal-container").style.display = "block";
        if (document.getElementById("btn-dku")) {
            document.getElementById("btn-dku").style.display = "block";
        }
        $("#form_checkout").validate().resetForm();
    } else if (e == "GP") {
        if (amount.value == 0) {
            $("#form_checkout").attr("action", "/v1/api/payments/give-away");
        } else {
            $("#form_checkout").attr("action", "/v2/api/payments/integrations/midtrans/inquiry");
        }
        if (document.getElementById("btn-dku")) {
            document.getElementById("btn-dku").style.display = "block";
        }
        document.getElementById("paypal-container").style.display = "none";
        seKformatter(IDR, e);
    } else {
        if (amount.value == 0 || am < 0) {
            $("#form_checkout").attr("action", "/v1/api/payments/give-away");
        } else {
            $("#form_checkout").attr("action", "/v2/api/payments/integrations/duitku/inquiry");
        }
        if (document.getElementById("btn-dku")) {
            document.getElementById("btn-dku").style.display = "block";
        }
        document.getElementById("paypal-container").style.display = "none";
    }
}
function giveBtnClick(e) {
    setTz();
    $("#form_checkout").submit();
}
function getU(url, args = {}) {
    let result;
    $.ajax({
        url: url,
        data: args,
        contentType: "application/json charset=utf-8",
        async: false,
        type: "GET",
        success: function (e) {
            result = e;
        },
    });
    return result;
}
function setTz() {
    document.getElementById("tz").value = timezone();
    document.getElementById("iana").value = moment.tz.guess();
}
function timezone() {
    var offset = new Date().getTimezoneOffset(),
        minutes = Math.abs(offset),
        hours,
        prefix;
    return (offset < 0 ? "+" : "-") + Math.floor(minutes / 60);
}
function seKformatter(IDR, method) {
    let shipping_fee = document.querySelector("#shipping_fee").value
    let admin_fee = get_fee(IDR, method);
    let billed_amount = parseFloat(IDR) + admin_fee + parseFloat(shipping_fee);
    let nf = new Intl.NumberFormat('en-US');
    $("#price_tag").text(`IDR ${nf.format(IDR)}`);
    $("#shipping_fee_tag").text(`IDR ${nf.format(shipping_fee)}`);
    $("#shipping_fee_tag").text(`IDR ${nf.format(shipping_fee)}`);
    $("#billed_amount").attr("value", `${billed_amount}`);
    $("#convenience_fee").attr("value", `${admin_fee}`);
    $("#convenience_fee_tag").text(`IDR ${nf.format(admin_fee)}`);
    $("#billed_amount_tag").text(`IDR ${nf.format(billed_amount)}`);
    document.querySelector("#btn-dku") && (document.querySelector("#btn-dku").innerHTML = `BUY NOW - IDR ${nf.format(billed_amount)}`);
}
function kFormatter(num) {
    return num ? (Math.abs(num) > 999 ? Math.sign(num) * (Math.abs(num) / 1e3) + "K" : Math.sign(num) * Math.abs(num)) : 0;
}
function get_fee(price, type) {
    let fee = 0;
    return (
        $.ajax({
            url: "/v1/api/payments/calc-con-fee",
            data: { value: price, type: type, ow0:ow0 },
            async: !1,
            success: function (e) {
                fee = e.message_data.fee;
            },
        }),
        fee
    );
}
function get_exch(value) {
    let USD = 0;
    return (
        $.ajax({
            url: "/exchangerate/idr",
            data: { value: value },
            async: !1,
            success: function (e) {
                USD = e.message_data.USD;
            },
        }),
        USD
    );
}
function received_callback(data) {
    $.ajaxSetup({
        beforeSend: function (x, settings) {
            /^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) || x.setRequestHeader("X-CSRFToken", document.getElementsByName("_csrf_token")[0].value);
        },
    });
    $.ajax({
        type: "POST",
        url: "/payments/callback",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        async: !1,
        success: function (e) {
            (data = e.message_data), "COMPLETED" == data.status && window.location.replace("/payment-thankyou?sess=" + data.sess);
        },
    });
}
document.addEventListener("click",function(e){if(e.target.id=="btn-dku"){if(e.ctrlKey||e.metaKey){e.preventDefault()}}});