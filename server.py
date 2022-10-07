import json
import time
import pymongo
import sys
import urllib.parse
import base64
import threading

sys.path.append("pytavia_core"    ) 
sys.path.append("pytavia_settings") 
sys.path.append("pytavia_stdlib"  ) 
sys.path.append("pytavia_storage" ) 
sys.path.append("pytavia_modules" ) 
sys.path.append("pytavia_modules/rest_api_controller") 
sys.path.append("pytavia_modules/user") 
sys.path.append("pytavia_modules/configuration") 
sys.path.append("pytavia_modules/view") 
sys.path.append("pytavia_modules/event_handler") 

from pytavia_stdlib      import utils
from pytavia_core        import database 
from pytavia_core        import config 
from pytavia_core        import model
from pytavia_core        import pytavia_events

from pytavia_stdlib      import idgen 
from pytavia_stdlib      import server_lib 

from rest_api_controller import module1 

from user                import register_proc
from user                import auth_proc

from configuration       import config_add
from event_loop_executor import event_loop_proc
from event_handler       import customer_evt_handler

from view import view_config_add
from view import view_login
from view import view_dashboard
from view import view_history

##########################################################

from flask import request
from flask import render_template
from flask import Flask
from flask import session
from flask import make_response
from flask import redirect
from flask import url_for
from flask import flash

from flask_wtf.csrf import CSRFProtect
from flask_wtf.csrf import CSRFError

########################## CREATOR FUNCTION ###################################

listenerThread  = threading.Thread()
pool_time       = 5

def main_app():
    app = Flask( __name__, config.G_STATIC_URL_PATH )

    def interrupt():
        global listenerThread
        listenerThread.cancel()
    # end def

    def listen_action():
        print ("listen_action: EXECUTE")
        pe = pytavia_events.pytavia_events({})
        pe.register_handler({
            "handler_name"       : "DASHBOARD_RT_ACCESS",
            "collection"         : "db_rt_dashboard",
            "handler"            : customer_evt_handler.customer_evt_handler({}),
            "query_filter"       : []
        })

        print ("event_loop: start action")
        pe.event_loop({
            "event_loop_wait"    : 60,
            "event_loop_execute" : event_loop_proc.event_loop_proc({})
        })
    # end def

    def event_listener_start():
        global yourThread
        listenerThread = threading.Timer(pool_time, listen_action, ())
        listenerThread.start()
    # end def

    event_listener_start()
    return app
# end def
#
# Main app configurations
#

app             = main_app()
csrf            = CSRFProtect(app)
app.secret_key  = config.G_FLASK_SECRET
app.db_update_context, app.db_table_fks = model.get_db_table_paths(model.db)


########################## CALLBACK API ###################################


########################## HTML PAGES   ##########################

@app.route('/' , methods=["GET"])
def admin_login():
    html_resp           = view_login.view_login(app).html({})
    html_status_code    = html_resp.get("status_code")
    if html_status_code == "0000":
        html = html_resp.get("data")["html"]
        return html
    else:
        html_desc = html_resp.get("desc")
        flash( html_desc )
        return html_desc
    # end if
# end def

@app.route('/user/dashboard' , methods=["GET","POST"])
@server_lib.logged_in()
def dashboard():
    html_resp           = view_dashboard.view_dashboard(app).html({})
    html_status_code    = html_resp.get("status_code")
    if html_status_code == "0000":
        html = html_resp.get("data")["html"]
        return html
    else:
        html_desc = html_resp.get("desc")
        flash( html_desc )
        return html_desc
    # end if
# end def

@app.route('/user/settings' , methods=["GET"])
@server_lib.logged_in()
def admin_settings():
    html_resp           = view_config_add.view_config_add(app).html({})
    html_status_code    = html_resp.get("status_code")
    if html_status_code == "0000":
        html = html_resp.get("data")["html"]
        return html
    else:
        html_desc = html_resp.get("desc")
        flash( html_desc )
    # end if
# end def

@app.route('/user/history' , methods=["GET"])
@server_lib.logged_in()
def admin_history():
    html_resp           = view_history.view_history(app).html({})
    html_status_code    = html_resp.get("status_code")
    if html_status_code == "0000":
        html = html_resp.get("data")["html"]
        return html
    else:
        html_desc = html_resp.get("desc")
        flash( html_desc )
    # end if
# end def

########################## PROCESSORS ##########################

#### AUTH PROCESSORS

@app.route('/proc/auth-login',methods=["POST"])
def auth():
    params      = request.form.to_dict()

    print ( "----------------------------------------" )
    print ( params )
    print ( "----------------------------------------" )

    response    = auth_proc.auth_proc(app).execute( params )
    status_code = response.get("status_code")
    if status_code != "0000":
        return redirect(url_for("admin_login"))
    # end if
    auth_data             = response.get("data")
    session["fk_user_id"] = auth_data["fk_user_id"]
    session["username"  ] = auth_data["username"]
    return redirect (url_for("dashboard"))
# end def

@app.route('/proc/register-user',methods=["GET"])
def register():
    params   = request.args.to_dict()
    response = register_proc.register_proc(app).execute( params )
    return redirect (url_for("admin_login"))
# end def

#### SETTINGS PROCESSORS ####

@app.route('/proc/config-add',methods=["POST"])
def settings_add():
    params   = request.form.to_dict()
    response = config_add.config_add(app).execute( params )
    return redirect (url_for("admin_settings"))
# end def

@app.route('/proc/config-del',methods=["POST"])
def settings_del():
    params   = request.args.to_dict()
    response = config_del.config_del(app).execute( params )
    return redirect (url_for("admin_settings"))
# end def

@app.route('/proc/config-edit',methods=["POST"])
def settings_edit():
    params   = request.form.to_dict()
    response = config_edit.config_edit(app).execute( params )
    return redirect (url_for("admin_settings"))
# end def

