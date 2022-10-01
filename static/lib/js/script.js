let visitorinfo = {}
function ipinfo(ajaxurl='https://ipinfo.io/json?token=a91b2fbf417b07', method='GET') { 
    return $.ajax({url: ajaxurl, type: method, async: false , success: function(res) { visitorinfo = res }});
};

$('#btn').click(function () {
  var mylinkid = document.getElementById("share_link").href
  copyToClipboard(mylinkid)

  var x = $(this).position();
  $('.toast-popup').css({ top: x.top })
  setTimeout(function () {
      $("#myToast").showToast({
          message: 'Link copied',
          duration: 1000,
          mode: 'info'
      });
  }, 500);
});
function showAToast(txt) {
  iqwerty.toast.toast(txt, {
    settings: {
      duration: 1000,
    },
    style: {
      main: {
        width: '110px',              
        bottom: "50%"          
      }
    }
  });
}
var copyToClipboard = function(text) {
  var input = document.body.appendChild(document.createElement("input"));
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('copy');
  input.parentNode.removeChild(input);
}

function getURL(url, args={}) {
  let result
  $.ajax({ url: url, data: args, contentType: "application/json charset=utf-8", async: false, type: 'GET', success: function(e){ result = e } })
  return result
}

function postURL(url, data) {
  return  $.ajax ({
    cache: false,
    async:false,
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr, settings) {
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", $("input[name=_csrf_token]").val());
      }
    }
  });    
}

function getConfig(str, default_= "") {
  let value = ""
  postURL("/api/v1/config/get", { key: str, default_ : default_ }).done(function(e) { value = e.value });
  return value;
}

function sortable(url) {
  $(".sortable").sortable({ handle: '.handle', axis: 'y', start: function(e, ui) { $(this).attr('data-previndex', ui.item.index());}, update: function (event, ui) {$(this).removeAttr('data-previndex');postURL(url, { data : $(".sortable").sortable('toArray') })} });
}
