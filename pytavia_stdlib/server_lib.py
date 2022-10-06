from functools          import wraps
from flask              import session
from flask              import make_response
from flask              import redirect
from flask              import url_for
from flask              import redirect
from flask              import escape
from flask              import request

def logged_in():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            fk_user_id = session.get("fk_user_id", None)
            if fk_user_id == None:
                return redirect(url_for("admin_login"))
            return f(*args, **kwargs)
        return decorated_function
    return decorator
