import json
import time
import pymongo
import sys
import urllib.parse
import base64

sys.path.append("pytavia_core"    ) 
sys.path.append("pytavia_settings") 
sys.path.append("pytavia_stdlib"  ) 
sys.path.append("pytavia_storage" ) 
sys.path.append("pytavia_modules" ) 
sys.path.append("pytavia_modules/rest_api_controller") 

# adding comments
from pytavia_stdlib  import utils
from pytavia_core    import database 
from pytavia_core    import config 
from pytavia_core    import model
from pytavia_stdlib  import idgen 

from rest_api_controller import module1 


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
#
# Main app configurations
#
app             = Flask( __name__, config.G_STATIC_URL_PATH )
csrf            = CSRFProtect(app)
app.secret_key  = config.G_FLASK_SECRET
app.db_update_context, app.db_table_fks = model.get_db_table_paths(model.db)

########################## CALLBACK API ###################################


########################## HTML PAGES   ##########################

@app.route('/user/dashboard' , methods=["GET","POST"])
def dashboard():
    return render_template('dashboard.html', active_nav = 'dashboard')

@app.route('/' , methods=["GET"])
def admin_login():
    return render_template('login.html')

@app.route('/user/settings' , methods=["GET"])
def admin_settings():
    return render_template('settings.html', active_nav = 'settings')

@app.route('/user/history' , methods=["GET"])
def admin_history():
    return render_template('history.html', active_nav = 'history')


########################## PROCESSORS ##########################

#### AUTH PROCESSORS

@app.route('/proc/auth-login',methods=["POST"])
def auth_proc():
    pass

@app.route('/proc/register-user',methods=["GET"])
def register():
    pass

#### SETTINGS PROCESSORS

@app.route('/proc/settings-add',methods=["POST"])
def settings_add():
    pass

@app.route('/proc/settings-del',methods=["POST"])
def settings_del():
    pass

@app.route('/proc/settings-edit',methods=["POST"])
def settings_edit():
    pass
