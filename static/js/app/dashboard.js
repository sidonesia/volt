force_battery_charge = function( switch_flag )
{
	AJAX_SERVER_call(
		force_battery_charge_callback,
		"POST",
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


export { process_request };
