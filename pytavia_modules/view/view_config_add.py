import sys
import traceback

sys.path.append("pytavia_core"    )
sys.path.append("pytavia_modules" )
sys.path.append("pytavia_settings")
sys.path.append("pytavia_stdlib"  )
sys.path.append("pytavia_storage" )

from flask          import render_template
from flask_login    import current_user
from pytavia_stdlib import idgen
from pytavia_stdlib import utils
from pytavia_core   import database
from pytavia_core   import config
from pytavia_core   import helper

class view_config_add:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self,app):
        pass
    # end def

    def config_view(self, params):
        response = helper.response_msg(
            "VIEW_CONFIG_LIST_SUCCESS",
            "VIEW CONFIG LIST SUCCESS", {},
            "0000"
        )
        try:
            config_view = self.mgdDB.db_config.find().sort("value", 1 )
            config_list = list( config_view )
            response.put( "data" ,  {
                "config_list" : config_list
            })
        except:
            print(traceback.format_exc())
            response.put( "status"      ,  "VIEW_CONFIG_LIST_FAILED" )
            response.put( "desc"        ,  "GENERAL ERROR" )
            response.put( "status_code" ,  "9999" )
        # end try
        return response
    # end def

    def html(self, params):
        response = helper.response_msg(
            "VIEW_ADMIN_ADD_HTML_SUCCESS",
            "VIEW ADMIN ADD HTML SUCCESS", {},
            "0000"
        )
        try:
            config_resp   = self.config_view( params )
            config_data   = config_resp.get("data")
            config_list   = config_data["config_list"]
            template_html = render_template(
                'config.html',
                config_list = config_list,
            )
            response.put( "data" , {
                "html" : template_html
            })
        except:
            print(traceback.format_exc())
            response.put( "status"      ,  "VIEW_ADMIN_ADD_HTML_FAILED" )
            response.put( "desc"        ,  "GENERAL ERROR" )
            response.put( "status_code" ,  "9999" )
        # end try
        return response
    # end def
# end class
