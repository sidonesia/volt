import urllib.parse
import base64
import traceback
import random
import urllib.request
import io
import requests
import json
import hashlib
import random
import sys

sys.path.append("pytavia_core")
sys.path.append("pytavia_settings")
sys.path.append("pytavia_stdlib")
sys.path.append("pytavia_storage")
sys.path.append("pytavia_modules")

from datetime           import datetime
from pytavia_stdlib     import idgen
from pytavia_stdlib     import utils
from pytavia_core       import database
from pytavia_core       import config
from pytavia_core       import helper
from pytavia_core       import bulk_db_insert
from pytavia_core       import bulk_db_update
from pytavia_core       import bulk_db_multi

class config_add:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self, app):
        self.webapp = app
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "CONFIG_ADD_SUCCESS",
            "CONFIG ADD SUCCESS", {},
            "0000"
        )
        name   = params["name"  ]
        value  = params["value" ]
        desc   = params["desc"  ]
        status = params["status"]
        misc   = params["misc"  ]
        data   = params["data"  ]

        data   = json.loads( data )
        try:
            mdl_db_config = database.new( self.mgdDB , "db_config" ) 
            mdl_db_config.put( "name"   , name   )  
            mdl_db_config.put( "value"  , value  ) 
            mdl_db_config.put( "desc"   , desc   ) 
            mdl_db_config.put( "status" , status ) 
            mdl_db_config.put( "misc"   , misc   ) 
            mdl_db_config.put( "data"   , data   ) 
            mdl_db_config.insert({})
            response.put( "data" , {
                "config" : mdl_db_config.get()
            })
        except:
            exception  = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "CONFIG_ADD_FAILED" )
            response.put( "desc"        , "CONFIG ADD FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
