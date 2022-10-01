
var confDomain = null;
var domain = null;



fn_get_domain_price = function()
{
    $("#btns").text("Please wait..");
    var domain  = $("#domainid").val();
    AJAX_SERVER_POST(
            fn_get_domain_price_FUNCTION,
            "GET",
            "/process/srsx/multi/domain/check?domain="+domain,
            {},
            true
    );
}

fn_get_domain_price_FUNCTION = function(msg_data)
{
    var message_action = msg_data.message_action;
    if (message_action == "API_DOMAIN_SUCCESS")
    {
      var domain_list = msg_data.message_data;
      $("#domainTable").html("");
      for ( var idx = 0; idx < domain_list.length; idx++)
      {
        $("#btns").text("Search");
        var domain_item = domain_list[idx];
        var extension   = domain_item.extension;
        var price_idr   = domain_item.price;
        domain = domain_item.domain;

        var button = `<button onclick="selectDomain('`+domain+`','`+price_idr+`');" type="button" class="Trs($c1) Scale(1.03):h Fz(12px) Cur(p) Py(8px) D(b) W(100%) Bdrs(4px) O(n) Bg($c1) Bd(n) C(#f9f9f9)">Select</button>`;
        if (domain_item.resultCode != "1000")
        {
            button = `Unavailable`;
        }
        var row_tmpl    = $("#domainTable_row").html();
        $("#tbl_head").removeClass("D(n)");
        $("#backBtn").removeClass("D(n)");
        
        row_tmpl = row_tmpl.replace(
                "__DOMAIN__"   ,
                      domain
              ).replace(
                      "__PRICE__" ,
                      price_idr
              ).replace(
                      "__DOMAIN2__",
                      domain
              ).replace(
                      "__PRICE2__",
                      price_idr
              ).replace(
                      "__BUTTON__",
                      button
              ).replace(
                      "<table>" ,
                      ""
              ).replace(
                      "<tbody  class='Bgc-dff3ea50'>" ,
                      ""
              ).replace(
                      "</table>",
                      ""
              ).replace(
                      "</tbody>",
                      ""
              )
              $("#domainTable").append(
                      row_tmpl
              )
          }
           MicroModal.init();         
         
    }
}

 function openCheckout() {      
    fn_buy_domain(domain);
  }  



selectDomain = function(confDomain,confPrice)
{
  MicroModal.show('modalPurchase');
  periode = $("#periode").val();
  domain = confDomain;
  $("#confDomain").text(confDomain);
  $("#confPrice").text('IDR '+confPrice);
  $("#confPeriode").text(periode+' Year');

}


fn_buy_domain = function(domain)
{
    var periode   = $("#periode").val();
    
    $("#msgStatus").text("Please wait..");
    http_params = {
        "domain"    : domain,
        "periode"   : periode,
    }

    AJAX_SERVER_POST(
            fn_buy_domain_FUNCTION,
            "POST",
            "/process/srsx/domain/register/user",
            http_params,
            true
    );
}

fn_buy_domain_FUNCTION = function(msg_data)
{
    var message_action = msg_data.message_action;
    if (message_action == "PRE_REGISTER_DOMAIN_SUCCESS")
    {
     window.location.replace("/register/domain/checkout?oid="+msg_data.message_data);  
    }
    if (message_action == "NOT_PREMIUM_USER")
    {
     window.location.replace("/admin/premium");   
    }
}


fn_unlink_domain = function()
{
    var unlinkdomain   = $("#unlinkdomainId").val();
    http_params = {
        "domain"    : unlinkdomain,
    }

    AJAX_SERVER_POST(
            fn_unlink_domain_FUNCTION,
            "POST",
            "/process/srsx/domain/unlink",
            http_params,
            true
    );
}

fn_link_domain_FUNCTION = function(msg_data)
{
    var message_action = msg_data.message_action;
    if (message_action == "LINK_SUCCESS")
    {
      location.reload(); 
    }
}

fn_link_domain = function(linkdomainID)
{
    // var linkdomainID = $("#linkdomainId").val();
    http_params = {
        "domain_key" : linkdomainID,
    }

    AJAX_SERVER_POST(
            fn_link_domain_FUNCTION,
            "POST",
            "/process/srsx/domain/link",
            http_params,
            true
    );
}

fn_unlink_domain_FUNCTION = function(msg_data)
{
    var message_action = msg_data.message_action;
    if (message_action == "UNLINK_SUCCESS")
    {
      location.reload(); 
    }
}


AJAX_SERVER_POST = function(callback_func, method, url, data, bool){

     var csrf_token = $("#csrf_token").val() ;
    _g_jqxhr = $.ajax({
                url      : url,
                method   : method,
                data     : JSON.stringify(data),
                dataType : "json",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                beforeSend: function(xhr, settings) {
                    if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                success: function(response,request){
                    callback_func(response);
                },
                error: function(response){
                    callback_func(response);
                }

        });
}

if (document.getElementById('domainid')){
    var search_box = document.getElementById('domainid');
    search_box.addEventListener("keyup", function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("btns").click();
          }
    }); 
}


const btn1 = document.querySelector('[data-btn-renew')
btn1.addEventListener('click', function(e){
fn_renew_domain(renewPackID);
});


fn_renew_domain = function(domain)
{

    $("#msgStatus").text("Please wait..");
    http_params = {
        "domain"    : domain,
        "periode"   : 1,
    }

    AJAX_SERVER_POST(
            fn_renew_domain_FUNCTION,
            "POST",
            "/process/srsx/domain/renew/user",
            http_params,
            true
    );
}

fn_renew_domain_FUNCTION = function(msg_data)
{
    const messageAction = msg_data.message_action;
    const messageData   = msg_data.message_data;

    if (messageAction == "PRE_RENEW_DOMAIN_SUCCESS")
    {
     window.location.replace("/renew/domain/checkout?oid="+msg_data.message_data.id);  
    } else {
        alert(messageData);
    }
    if (messageAction == "NOT_PREMIUM_USER")
    {
     window.location.replace("/admin/premium");   
    }
}