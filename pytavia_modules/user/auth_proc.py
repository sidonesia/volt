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

class auth_proc:

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
        username = params["username"]
        password = params["password"]
        try:
            password_hash = utils._get_passwd_hash({
                "id"        : username,
                "password"  : password
            })
            user_rec = self.mgdDB.db_user.find_one({
                "username" : username,
                "password" : password_hash
            })
            fk_user_id = user_rec["pkey"]
            response.put( "data" , {
                "fk_user_id" : fk_user_id,
                "username"   : username
            })
        except:
            exception  = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "AUTH_ACCESS_FAILED" )
            response.put( "desc"        , "AUTH ACCESS FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class
