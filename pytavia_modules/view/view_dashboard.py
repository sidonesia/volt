import sys
import traceback
import datetime
import time

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

class view_dashboard:

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self,app):
        pass
    # end def

    def get_dashboard(self, params):
        response = helper.response_msg(
            "DASHBOARD_SUCCESS",
            "DASHBOARD SUCCESS", {},
            "0000"
        )
        try:
            rt_dashboard_rec = self.mgdDB.db_rt_dashboard.find_one({
                "name" : "DASHBOARD"
            })
            del rt_dashboard_rec["_id"]
            response.put( "data" , {
                "dashboard_rec" : rt_dashboard_rec
            })
        except:
            print(traceback.format_exc())
            response.put( "status"      ,  "DASHBOARD_FAILED" )
            response.put( "desc"        ,  "GENERAL ERROR" )
            response.put( "status_code" ,  "9999" )
        # end try
        return response
    # end def

    def get_hourly_usage(self, params):
        response = helper.response_msg(
            "DASHBOARD_SUCCESS",
            "DASHBOARD SUCCESS", {},
            "0000"
        )
        try:
            today                = datetime.datetime.now()
            year_month_date_hour = today.strftime("%Y_%m_%d_%H")
            hourly_log_rec       = self.mgdDB.db_usage_hourly_log.find_one({
                "year_month_date_hour" : year_month_date_hour
            })
            del hourly_log_rec["_id"]
            response.put("data", {
                "hourly_log_rec" : hourly_log_rec
            })
        except:
            print(traceback.format_exc())
            response.put( "status"      ,  "DASHBOARD_FAILED" )
            response.put( "desc"        ,  "GENERAL ERROR" )
            response.put( "status_code" ,  "9999" )
        # end try
        return response
    # end def


    def html(self, params):
        response = helper.response_msg(
            "VIEW_HTML_SUCCESS",
            "VIEW HTML SUCCESS", {},
            "0000"
        )
        try:
            resp_dashboard       = self.get_dashboard( params )
            dashboard_rec        = resp_dashboard.get("data")["dashboard_rec"]

            resp_hourly          = self.get_hourly_usage( params )
            hourly_log_rec       = resp_hourly.get("data")["hourly_log_rec"]
            avg_power_hourly     = round( hourly_log_rec["avg_power"] , 2 )

            template_html        = render_template(
                'dashboard.html',
                dashboard_item   = dashboard_rec,
                avg_power_hourly = avg_power_hourly
            )
            response.put( "data" , {
                "html" : template_html
            })
        except:
            print(traceback.format_exc())
            response.put( "status"      ,  "VIEW_HTML_FAILED" )
            response.put( "desc"        ,  "GENERAL ERROR" )
            response.put( "status_code" ,  "9999" )
        # end try
        return response
    # end def
# end class
