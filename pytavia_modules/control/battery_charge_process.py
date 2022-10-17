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
        config_rec              = self.mgdDB.db_config.find_one({ 
            "value" : config.G_GPIO_BATTERY_CHARGE_SETUP
        })
        gpio_status             = config_rec["data"]["gpio_setup_state"]
        gpio_battery_charge_pin = config_rec["data"]["battery_charge_pin"]
        if gpio_status == config.G_GPIO_BATTERY_CHARGE_STATE_FALSE:
            GPIO.setmode( GPIO.BOARD )
            GPIO.setup( gpio_battery_charge_pin , GPIO.OUT )
            self.mgdDB.db_config.update_one(
                { "value" : config.G_GPIO_BATTERY_CHARGE_SETUP  } ,
                { "$set"    : { 
                    "data.gpio_setup_state" : config.G_GPIO_BATTERY_CHARGE_STATE_TRUE 
                }}
            )
        # end if
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "CHARGE_PROCESS_CHANGE_STATE_SUCCESS",
            "CHARGE PROCESS CHANGE STATE SUCCESS", {},
            "0000"
        )
        battery_status_pid = params["battery_status_pid"]
        battery_status     = params["battery_status"]
        battery_status     = int( battery_status )
        current_tm         = int( time.time() * 1000 )
        try:
            #
            # if the state sent is different then we update otherwise we 
            #   leave it as it is
            #
            gpio_config_rec      = self.mgdDB.db_config.find_one({ 
                "value"                   : config.G_GPIO_BATTERY_CHARGE_SETUP,
                "data.battery_device_pid" : battery_status_pid
            })
            battery_charge_pin   = gpio_config_rec["data"]["battery_charge_pin"  ]
            battery_device_name  = gpio_config_rec["data"]["battery_device_name" ]
            battery_device_value = gpio_config_rec["data"]["battery_device_value"]
            battery_device_type  = gpio_config_rec["data"]["battery_device_type" ]
            battery_device_desc  = gpio_config_rec["data"]["battery_device_desc" ]
            battery_device_pid   = gpio_config_rec["data"]["battery_device_pid"  ]

            battery_live_state   = GPIO.input( battery_charge_pin )
            if battery_live_state != battery_status:
                GPIO.output( battery_charge_pin , battery_status )
                device_state_rec = self.mgdDB.db_rt_device_state.find_one({
                    "value"    : battery_status,
                    "pid_code" : battery_device_pid
                })
                if device_state_rec == None:
                    mdl_device_state = database.new( self.mgdDB , "db_rt_device_state" )
                    mdl_device_state.put( "name"          , battery_device_name  )
                    mdl_device_state.put( "value"         , battery_device_value )
                    mdl_device_state.put( "type"          , battery_device_type  )
                    mdl_device_state.put( "desc"          , battery_device_desc  )
                    mdl_device_state.put( "pid_code"      , battery_device_pid   )
                    mdl_device_state.put( "digital_state" , battery_status )
                    mdl_device_state.put( "analog_state"  , 1  )
                    mdl_device_state.put( "last_update"   , current_tm )
                    mdl_device_state.insert()
                else:
                    self.mgdDB.db_rt_device_state.find_one(
                        { "pid_code" : battery_device_pid },
                        { "$set"     : { "digital_state" : battery_state }}
                	)
                # end if
            # end if
        except:
            exception = traceback.format_exc()
            print( exception )
            response.put( "status_code" , "9999" )
            response.put( "status" , "CHARGE_PROCESS_CHANGE_STATE_FAILED" )
            response.put( "desc"   , "CHARGE PROCESS CHANGE_STATE FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
