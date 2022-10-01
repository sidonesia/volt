$(document).ready(function () {
    $('#username').on('keydown', function(e) {
      if (e.which == 13) {
        e.preventDefault();
        var url_path 
        if (tlog) {
          url_path = "/admin"
        } else {
          url_path = "/register"
          var username = document.getElementById('username').value
          if (username) {
            var o = new Object()
            o.username = username
            url_path += "?"+$.param(o)
          }
        }
        window.location.href = url_path;
      }
    })
  })