const cbcon      = document.querySelector('#cb-container'     )
const btcon      = document.querySelector('#button-container' )
const amount     = document.querySelector('#amount'           )

if (amount.value == 0) {
  $("#z1").attr('checked', 'checked');
  $('input[name="payment_method"]').attr("disabled","disabled");
} else {
  $("#form_checkout").attr('action', "/v2/api/payments/integrations/duitku/inquiry")
}

$('#btn-free').click(function(e){  
  document.getElementById("zip").value  = gg
  if ($("#form_checkout").valid()) {
  $("#form_checkout").attr('action', "/v1/api/payments/give-away"); 
  $("#form_checkout").submit()
  }
})
document.getElementById("tz").value = timezone();
document.getElementById('iana').value = moment.tz.guess()

$("#payer_email").keypress(function (e) {
    if (13 == e.which) return !1;
});

$("#pal_email").keypress(function (e) {
    if (13 == e.which) return !1;
});
