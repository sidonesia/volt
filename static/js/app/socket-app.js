var event_processor = null;

$( document ).ready(
    function()
    {
        //
        // create the event handler processor to accept
        //      and connect on port 5000
        //
        var pep = new pytavia_event_processor(
            document.domain, "5000"
        );

        //
        // register the event we want to listen on and the
        //      callback handler here
        //
        pep.register(
            "PYTAVIA_CMD_EVENT_INIT", callback_draw_data
        );

        //
        // start our subscription process
        //
        pep.begin_subscribe();

        //
        // send a HI to the server to make sure we are connected
        //      and for the counter
        //
        pep.publish ({
            event_name : "PYTAVIA_REQUEST_EVENT_INIT",
            event_data : {
                "msg"  : "Hi .. ack",
                "time" : new Date().getTime(),
                "port" : 5000
            }
        })
    }
);

callback_draw_data = function( msg )
{
	console.log( msg );
};

AJAX_SERVER_call = function(callback_func, method, wservice, uri, bool)
{
        var jqxhr = $.ajax(
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

