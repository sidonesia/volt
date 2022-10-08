var event_processor = null;

$( document ).ready(
    function()
    {
        //
        // create the event handler processor to accept
        //      and connect on port 5000
        //
	console.log("start pytavia_event_processor")
        var pep = new pytavia_event_processor(
            document.domain, "5000"
        );

        //
        // register the event we want to listen on and the
        //      callback handler here
        //
	console.log("register the event PYTAVIA_CMD_EVENT_INIT")
        pep.register(
            "PYTAVIA_CMD_EVENT_INIT", callback_draw_data
        );

	console.log("register the event PYTAVIA_CMD_EVENT")
        pep.register(
            "PYTAVIA_CMD_EVENT", callback_cmd_event
        );

        //
        // start our subscription process
        //
	console.log("subscribe the event")
        pep.begin_subscribe();

        //
        // send a HI to the server to make sure we are connected
        //      and for the counter
        //
	console.log("publish the event")
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

callback_cmd_event = function( msg )
{
	console.log( msg );
};

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

