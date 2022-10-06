import json
import time
import pymongo
import sys
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

class register_proc:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self, app):
        self.webapp = app
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "REGISTER_SUCCESS",
            "REGISTER SUCCESS", {},
            "0000"
        )
        username = params["username"]
        password = params["password"]
        role     = params["role"]
        try:
            now_time      = int( time.time() * 1000)
            password_hash = utils._get_passwd_hash({
                "id"        : username,
                "password"  : password
            })
            mdl_user = database.new( self.mgdDB , "db_user" )
            mdl_user.put( "username" , username )
            mdl_user.put( "password" , password_hash )
            mdl_user.put( "role" , role )
            mdl_user.put( "last_login" , now_time )
            mdl_user.insert()
        except:
            exception = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "REGISTER_FAILED" )
            response.put( "desc"        , "REGISTER_FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
