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

callback_draw_data = function( msg )
{
	console.log( msg );
};

callback_cmd_event = function( msg )
{
	event_type = msg.event_type
	if (event_type  == "EVENT_UPDATE_DASHBOARD")
	{
		var msg_data 	    = msg.data
		var current 	    = msg_data.current
		var battery_voltage = msg_data.battery_voltage
		var power 	    = msg_data.power
		var battery_soc     = msg_data.battery_soc
		var hourly_kwh      = msg_data.hourly_kwh
		var hourly_amph     = msg_data.hourly_amph
		var shunt_voltage   = msg_data.shunt_voltage

		$("#ampere_id"	     ).html( current )
		$("#power_id"	     ).html( power   )
		$("#battery_volt_id" ).html( battery_voltage )
		$("#id_battery_soc"  ).html( battery_soc )
		$("#hourly_kwh_id"   ).html( hourly_kwh )
		$("#amp_hour_id"     ).html( hourly_amph )
		$("#shunt_voltage_id").html( shunt_voltage )
	}
};

process_request = function(function_type , switch_flag)
{
        if (function_type  == "force_battery_charging_id")
        {
                force_battery_charge(switch_flag);
        }
        if (function_type  == "smart_battery_charging_id")
        {
                smart_battery_charge(switch_flag);
        }
};

force_battery_charge = function( switch_flag )
{
        AJAX_SERVER_call(
                force_battery_charge_callback,
                "GET",
                "/api/force-battery-charging",
                {
                        "battery_status"     : switch_flag,
                        "battery_status_pid" : "BCS001"
                },
                true
        );
}

force_battery_charge_callback = function( msg )
{
        console.log( msg );
}

smart_battery_charge = function( function_type, switch_flag )
{
}

smart_battery_charge_callback = function( function_type, switch_flag )
{
}

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
