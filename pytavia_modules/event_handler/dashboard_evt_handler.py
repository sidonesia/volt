import json
import time
import pymongo
import sys
import urllib.parse
import base64
import traceback
import datetime

sys.path.append("pytavia_core"    )
sys.path.append("pytavia_settings")
sys.path.append("pytavia_stdlib"  )
sys.path.append("pytavia_storage" )
sys.path.append("pytavia_modules" )

from pytavia_core import pytavia_event_handler
from pytavia_core import database
from pytavia_core import config
from pytavia_core import bulk_db_multi
from pytavia_core import helper


class dashboard_evt_handler(pytavia_event_handler.pytavia_event_handler):

    mgdDB    = database.get_db_conn( config.mainDB )
    socketio = None

    def __init__(self, params):
        self.socketio = params["socketio"]
        pytavia_event_handler.pytavia_event_handler.__init__(self,params)
    # end def

    def time_gen(self, params):
        response = helper.response_msg(
            "TIME_GEN_SUCCESS",
            "TIME GEN SUCCESS", {},
            "0000"
        )
        try:
            epoch_time               = int(time.time() * 1000)
            today                    = datetime.datetime.now()
            year                     = today.strftime("%Y")
            year_month               = today.strftime("%Y_%m")
            year_month_date          = today.strftime("%Y_%m_%d")
            year_month_date_hour     = today.strftime("%Y_%m_%d_%H")
            year_month_date_hour_min = today.strftime("%Y_%m_%d_%H_%M")
            hour                     = today.strftime("%H")
            minute                   = today.strftime("%M")
            day                      = today.strftime("%A").upper()

            hour                     = int( hour )
            minute                   = int( minute )

            response.put("data" , {
                "epoch_time"                : epoch_time,
                "year"                      : year,
                "year_month"                : year_month,
                "year_month_date"           : year_month_date,
                "year_month_date_hour"      : year_month_date_hour,
                "year_month_date_hour_min"  : year_month_date_hour_min,
                "hour"                      : hour,
                "minute"                    : minute,
                "day"                       : day,
            })
        except:
            exception = traceback.format_exc()
            print( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "WRITE_SENSOR_FAILED" )
            response.put( "desc"        , "WRITE SENSOR FAILED " + str( exception )  )
        # end try
        return response
    # end def

    """ 
        {
            'battery_soc': 95.255, 
            'battery_voltage': 13.05, 
            'current_usage_out': 1.4, 
            'power_usage_out': 18.3
        }, 
        'removedFields': []
    """
    def process_dashboard_update(self, event):
        event_data           = event.get("data")
        updated_fields       = event_data["updatedFields"]
        time_response        = self.time_gen({})

        time_data            = time_response.get("data")
        year_month_date_hour = time_data["year_month_date_hour"]

        rt_hourly_log_rec    = self.mgdDB.db_usage_hourly_log.find_one({
            "year_month_date_hour" : year_month_date_hour
        })
        rt_dashboard_rec     = self.mgdDB.db_rt_dashboard.find_one({
            "name" : "DASHBOARD"
        })

        avg_shunt_voltage    = rt_hourly_log_rec["avg_shunt_voltage"]
        avg_power            = rt_hourly_log_rec["avg_power"]
        avg_current          = rt_hourly_log_rec["avg_current"]

        avg_shunt_voltage    = round( avg_shunt_voltage , 2 )
        avg_power            = round( avg_power , 2 )
        avg_current          = round( avg_current , 2 )

        battery_soc          = rt_dashboard_rec["battery_soc"]
        battery_voltage      = rt_dashboard_rec["battery_voltage"]
        current_usage_out    = rt_dashboard_rec["current_usage_out"]
        power_usage_out      = rt_dashboard_rec["power_usage_out"]

        if "battery_soc" in updated_fields:
            battery_soc = updated_fields["battery_soc"]
        # end if
        if "battery_voltage" in updated_fields:
            battery_voltage = updated_fields["battery_voltage"]
        # end if
        if "current_usage_out" in updated_fields:
            current_usage_out = updated_fields["current_usage_out"]
        # end if
        if "power_usage_out" in updated_fields:
            power_usage_out = updated_fields["power_usage_out"]
        # end if

        e_mesg  = helper.event_msg(
            "EVENT_UPDATE_DASHBOARD",
            { 
                "current" : current_usage_out, 
                "power" : power_usage_out,
                "battery_soc" : battery_soc,
                "battery_voltage" : battery_voltage,
                "hourly_kwh" : avg_power,
                "hourly_amph" : avg_current,
                "shunt_voltage" : avg_shunt_voltage
            }
        )
        self.socketio.emit(
            helper.CMD_EVENT,
            e_mesg.json()
        )
    # end def

    def event_switch(self, event):
        pytavia_event_handler.pytavia_event_handler.event_switch( self, event)
        try:
            event_action = event.get("action")
            if event_action == "UPDATE":
                self.process_dashboard_update( event )
                sys.stdout.flush()
            # end if     
        except:
            print( traceback.format_exc() )
        # end try
    # end def
# end class

