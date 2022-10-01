 $(document).ready(function(){
      fn_window_resizing();
      load_notification();
  });


fn_window_resizing = function()
{
    var content_data = $("#content").text();
    if ($(window).width() < 671) {
       $("#notif_content").addClass("D(n)");
    }
    else if ($(window).width() > 670 && content_data.length < 1) {
       $("#notif_content").addClass("D(n)");
      $("#norif_null").removeClass("D(n)");
    }
    else
    {
      $("#notif_content").removeClass("D(n)");
    }
}

$(window).resize(function() {
  fn_window_resizing();
});

  
var templateContainer = $("#template-container");
load_notification = function()
{

  $('#pagination').pagination({
    dataSource: '/v1/get/notifications',
    locator:"message_data.notif_list",
    pageSize: 5,
    totalNumberLocator: function(response){
        return response.message_data.notif_count;
    },  
    showPageNumbers: true,
    showPrevious: true,
    showNext: true,
     ajax: {
          beforeSend: function() {                    
              templateContainer.html("<div style='color:white;'>loading......</div> ");
          }
      },
      callback: function(data, pagination) {

          templateContainer.html("");
          for (var i = 0; i < data.length; i++)
          {

            var notif_id = data[i].pkey; 
            var date     = data[i].date; 
            var title    = data[i].title; 
            var fonts    = "Fw(700) ";
            if (data[i].is_open == "TRUE" )
            {
              fonts = "";
            }
            var href;

            if ($(window).width() < 671) {
                href = `<a href="/admin/notification/details?id=`+notif_id+`"`;
              }
            else
              {
                href = `<a href="javascript:void(0);" onclick="fn_get_notif_detail('`+notif_id+`');"`;
              }


            var html = href+`
             class="Bd($c2):h D(b) Mt(4px) Bd($c15) P(8px) Bdrs(4px)">
                <p class="Ff($l) Fz(12px) Op(0.5) Mb(4px)">`+date+`</p>
                    <p class="Ff($l) Fz(14px) `+fonts+`overflow-elips"> `+title+`</p>
              </a> 
            `;

            var html = href+`
             class="Bd($c2):h D(b) Mt(4px) Bd($c15) P(8px) Bdrs(4px)">
                <p class="Ff($l) Fz(12px) Op(0.5) Mb(4px)">`+date+`</p>
                    <p class="Ff($l) Fz(14px) `+fonts+`overflow-elips"> `+title+`</p>
              </a> 
            `;
            templateContainer.append(html);
        
          }

      }
  });

}



fn_get_notif_detail = function(notif_id)
{
      AJAX_SERVER_call(
        fn_get_notif_detail_CALLBACK,
        "GET",
        "/v1/get/notification/details",
        {"id": notif_id},
        true
    );
}

fn_get_notif_detail_CALLBACK = function(msg_data)
{
  var message_action = msg_data.message_action;
  var message_data = msg_data.message_data;
  if (message_action == "GET_NOTIFICATION_SUCCESS")
  {

    var content = message_data.content;
    var title   = message_data.title;
    var date    = message_data.rec_timestamp;

    if ($(window).width() > 670 && content !== null) {
       $("#notif_content").removeClass("D(n)");
       $("#norif_null").addClass("D(n)");
    };


    $("#title").text(title);
    $("#content").html(content);
    $("#content").html(content);
    $("#date").html(date);
  }
}


AJAX_SERVER_call = function(callback_func, method, wservice, uri, bool)
{
        _g_jqxhr = $.ajax(
        {
                url      : wservice ,
                method   : method   ,
                data     : uri      ,
                dataType : "json"
        }).done(
                function(msg_json)
                {
                        callback_func(msg_json);
                }
        ).fail(
                function(msg_json)
                {
                        callback_func(msg_json);
                }
        ).always(
                function()
                {
                }
        );
};