let packagePrice = parseFloat(document.getElementById("total_amount").value)
let default_method = 'OV'
let payment_method = default_method
let no_min_list = ['GP','OV','SA', 'SP']
let min_payment = 10000
let billed_amount = document.getElementById('billed_amount')
let max_pay_exceed = getURL('/v1/api/payments/max-exceed-payment-list').message_data

$('input[name=payment_method]').click(function(){
    payment_method = this.value
    if (this.value == 'PP') {
        let admin_fee = get_fee(packagePrice, 'PP')
        let price_usd = get_exch(packagePrice)
        let fee_usd = get_exch(admin_fee)
        let total_usd = (price_usd + fee_usd).toFixed(2)

        $("#originalprice_tag").text(`USD ${price_usd}`)
        $("#billed_amount").attr('value',`${total_usd}`)
        $("#convenience_fee").attr('value',`${admin_fee}`)
        $("#convenience_fee_tag").text(`USD ${fee_usd}`)
        $("#billed_amount_tag").text(`USD ${total_usd}`)

        document.getElementById('paypal-container').style.display = 'block'
        document.getElementById('btn-dku').style.display = 'none'
        $("#form_checkout").validate().resetForm();
    }  else if (this.value == 'GP') {
        $("#form_checkout").attr('action', "/v1/api/payments/integrations/midtrans/inquiry")
        document.getElementById('btn-dku').style.display = 'block'
        document.getElementById('paypal-container').style.display = 'none'
        document.getElementById('msg').style.display = 'none';
        let IDR = document.getElementById("amount").value
        seKformatter(IDR, this.value)
    } else {
        var newinput   = document.createElement("input");
        newinput.type  = 'hidden';
        newinput.name  = 'inq_type';
        newinput.value = inqType;
        document.getElementById('form_checkout').appendChild(newinput);
        $("#form_checkout").attr('action', "/v1/api/domain/payment/duitku/inquiry")
        document.getElementById('btn-dku').style.display = 'block'
        document.getElementById('paypal-container').style.display = 'none'
        let IDR = document.getElementById("total_amount").value
        seKformatter(IDR, this.value)
    }
});

function seKformatter(IDR, method) {
    let admin_fee = get_fee(IDR, method)
    let billed_amount = parseFloat(IDR) + admin_fee

    $("#originalprice_tag").text(`IDR ${kFormatter(IDR)}`)
    $("#billed_amount").attr('value',`${billed_amount}`)
    $("#convenience_fee").attr('value',`${admin_fee}`)
    $("#convenience_fee_tag").text(`IDR ${kFormatter(admin_fee)}`)
    $("#billed_amount_tag").text(`IDR ${kFormatter(billed_amount)}`)
}

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

function kFormatter(num) {
    if (num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000)) + 'K' : Math.sign(num)*Math.abs(num)
    } else {
        return 0
    }
}

function get_fee(price, type) {
    let fee = 0
    $.ajax({
        url: '/v1/api/payments/calc-con-fee',
        data: { value : price, type : type },
        async: false,
        success:function(e) {
            data_fee = JSON.parse(e);
            if (data_fee.message_data.fee) {
                fee = data_fee.message_data.fee
            }
        }
    })
    return fee
}

function get_exch(value) {
    let USD = 0
    $.ajax({
        url: '/exchangerate/idr',
        data: { value : value },
        async: false,
        success:function(e) {
            data_exchange = JSON.parse(e);
            if (data_exchange.message_data.USD) {
                USD = data_exchange.message_data.USD
            }
        }
    })
    return USD
}

function openModalAlert(bodyContent) {
  $('#modalAlertBody').html(bodyContent);
  MicroModal.show('modalAlert');
}

paypal.Buttons({
  style: {
        label: 'checkout',
        size: 'medium',
        shape: 'rect',
        color: 'blue'
  },
  onClick: function(data, actions) {},
  createOrder : function(data, actions) {
    return actions.order.create({
      purchase_units : [{
        amount: {
          currency_code : 'USD',
          value : document.querySelector("#billed_amount").value
        }
      }]
    });
  },
  onApprove : function(data, actions) {
    return actions.order.capture().then(function(details){
        if(details){
            details.domain_id = $("#domain_id").val()
        }

        $("#loader").removeClass("D(n)");
        $.ajax({
          url: "/v1/api/domain/paypal/payment",
          async: false,
          type: "POST",
          contentType:"application/json; charset=utf-8",
          data: JSON.stringify(details),
          success:function(response) {
            let msg_data = JSON.parse(response);
            if (msg_data.message_data.status == "COMPLETED")
            {
                location.replace(msg_data.message_data.returnUrl);
            }
          },
          error:function(xhr, textStatus, errorThrown) {
            $("#loader").addClass("D(n)");
            openModalAlert('Send paypal data to backend failed!');
          }
        });
    })
  },
  onCancel : function(data) {
  },
}).render('#paypal-container');

$(document).ready(function() {
  $.ajaxSetup({
    beforeSend: function(x, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            x.setRequestHeader("X-CSRFToken", document.getElementsByName('_csrf_token')[0].value)
        }

        if (x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
        }
    }
  });

  $("#ov").click();
  $("#loader").addClass("D(n)");
});
