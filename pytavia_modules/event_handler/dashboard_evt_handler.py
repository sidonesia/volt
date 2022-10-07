import json
import time
import pymongo
import sys
import urllib.parse
import base64
import traceback

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
        event_data        = event.get("data")
        updated_fields    = event_data["updatedFields"]
        rt_dashboard_rec  = self.mgdDB.db_rt_dashboard.find_one({
            "name" : "DASHBOARD"
        })
        battery_soc       = rt_dashboard_rec["battery_soc"]
        battery_voltage   = rt_dashboard_rec["battery_voltage"]
        current_usage_out = rt_dashboard_rec["current_usage_out"]
        power_usage_out   = rt_dashboard_rec["power_usage_out"]

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
                "battery_voltage" : battery_voltage
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

