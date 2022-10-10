import  json
import  time
import  pymongo
import  sys
import  urllib.parse
import  base64
import  datetime

import  logging
import  traceback
import  time
import  numpy    as np
import  RPi.GPIO as GPIO

from    time import sleep

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

class battery_charge_process:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self, app):
        self.webapp = app
        config_rec  = self.mgdDB.db_config.find_one({ "value" : "GPIO_SETUP"})
        gpio_bool   = config_rec["data"]["gpio_setup_boolean"]
        if gpio_bool == 0:
            GPIO.setmode( GPIO.BOARD )
            GPIO.setup( config.G_BATTERY_ACTIVATE_PIN , GPIO.OUT )
        # end if
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "CHARGE_PROCESS_SUCCESS",
            "CHARGE PROCESS SUCCESS", {},
            "0000"
        )
        battery_status = params["battery_status"]
        battery_status = int( battery_status )
        try:
            # if the state sent is different then we update otherwise we 
            #   leave it as it is
            battery_state_status = GPIO.input( config.G_BATTERY_ACTIVATE_PIN )
            if battery_state_status != battery_status:
                GPIO.output( config.G_BATTERY_ACTIVATE_PIN , battery_status )
            # end if
        except:
            exception = traceback.format_exc()
            print( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "CHARGE_PROCESS_FAILED" )
            response.put( "desc"        , "CHARGE PROCESS FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
