
let price          = parseFloat(document.getElementById("price").value)
let shipping_fee   = parseFloat(document.getElementById("shipping_fee").value)
let payment_method = default_method
let min_payment    = 10000
let billed_amount  = document.getElementById('billed_amount')

let max_pay_exceed = getURL('/v1/api/payments/max-exceed-payment-list').message_data

$('input[name=payment_method]').click(function(){
    payment_method = this.value
    if (this.value == 'PP') {
        let admin_fee     = get_fee(price, 'PP')
        let sf_usd        = get_exch(shipping_fee)
        let price_usd     = get_exch(price)
        let fee_usd       = get_exch(admin_fee)
        let total_usd     = (price_usd + fee_usd + sf_usd).toFixed(2)

        $("#price_tag").text(`USD ${price_usd}`)
        $("#shipping_fee_tag").text(`USD ${sf_usd}`)
        $("#shipping_fee").attr('value', `${sf_usd}`);
        $("#billed_amount").attr('value',`${total_usd}`)
        $("#convenience_fee").attr('value',`${admin_fee}`)
        $("#convenience_fee_tag").text(`USD ${fee_usd}`)
        $("#billed_amount_tag").text(`USD ${total_usd}`)

        document.getElementById('paypal-container').style.display = 'block'
        document.getElementById('btn-dku').style.display = 'none'
        $("#form_checkout").validate().resetForm();
    }  else if (this.value == 'GP') {
        $("#form_checkout").attr('action', "/v2/api/payments/integrations/midtrans/inquiry")
        document.getElementById('btn-dku').style.display = 'block'
        document.getElementById('paypal-container').style.display = 'none'
        let IDR = document.getElementById("amount").value
        seKformatter(IDR, this.value)
    } else {
        $("#form_checkout").attr('action', "/v2/api/payments/integrations/duitku/inquiry")
        document.getElementById('btn-dku').style.display = 'block'
        document.getElementById('paypal-container').style.display = 'none'
        let IDR = document.getElementById("amount").value
        seKformatter(IDR, this.value)
    }
});

jQuery.validator.addMethod("isemail", function(value, element) {
    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}, '');

jQuery.validator.addMethod("validAmount", function(value, element) {
    pm_checked_val = $("input[name='payment_method']:checked").val()
    if (max_pay_exceed[pm_checked_val]) {
        if (billed_amount.value > max_pay_exceed[pm_checked_val]) {
            alert("Max transaction amount Rp " + max_pay_exceed[pm_checked_val] + ", please select other method !")
            $("input[name=payment_method][value="+default_method+"]").prop('checked', true);
            return false
        }
    }
    if (document.getElementById('billed_amount').value > 0 && document.getElementById('billed_amount').value < min_payment && !no_min_list.includes(payment_method)) {
        alert("Minimum Payment " + min_payment)
        return false
    } 
    return true
}, '');


$("#form_checkout").validate({
    onblur: !0,
    onkeyup: !1,
    ignore: "",
    onfocusout: function (element) {
        this.element(element);
    },
    rules: { amount: { required: !0, validAmount: !0 }, payer_email: { required: !0, isemail: !0 } },
    messages: { payer_email: { required: "Email is required", isemail: "Wrong Email Format" } },
    invalidHandler: function (form, validator) {
        var errors;
        validator.numberOfInvalids() && $("html, body").animate({ scrollTop: $(validator.errorList[0].element).offset().top - 500 }, 500);
    },
});