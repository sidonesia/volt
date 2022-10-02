#!/usr/bin/env python

from    ina219 import INA219
from    ina219 import DeviceRangeError
from    time import sleep

import  json
import  time
import  pymongo
import  sys
import  urllib.parse
import  base64

import  logging
import  traceback
import  time
import  numpy as np

sys.path.append("pytavia_core"    )
sys.path.append("pytavia_settings")
sys.path.append("pytavia_stdlib"  )
sys.path.append("pytavia_storage" )
sys.path.append("pytavia_modules" )

from pytavia_core import pytavia_event_handler
from pytavia_core import database
from pytavia_core import config
from pytavia_core import bulk_db_multi

class auth:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self, app):
        self.webapp = app
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "AUTH_ACCESS_SUCCESS",
            "AUTH ACCESS SUCCESS", {},
            "0000"
        )
        try:
            pass
        except:
            exception = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "AUTH_ACCESS_FAILED" )
            response.put( "desc"        , "AUTH ACCESS FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
