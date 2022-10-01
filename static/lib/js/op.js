let start      = metadata.page;
let limit      = metadata.limit;
let totalcount = metadata.total;
let url        = window.location.href.split('?')[0] + "?pg="
set_pagination(start, totalcount);

$('#prev-pg').on("click",function (e) { 
  changePage('prev','','')
})

$('#next-pg').on("click",function (e) { 
  changePage('','','next')
})

function set_pagination(currentPage, totalcount) {
  var HTML = ''
  if (totalcount > 1) {
    HTML += '<li><a title="Previous" href="javascript:void(0)" id="prev-pg"  class="D(f) M(3px)"><img src="/static/assets/imgs/feather-ico/arrow-left-solid.svg" class="W(16px) H(a)" alt=""></a></li>';
  }
  if (totalcount <= 6) {
    for (i = 1; i <= totalcount; i++) {
        HTML += addButton(i, currentPage);
    }
  } else {

    HTML += addButton("1", currentPage);

    if (currentPage > 3) {
        HTML += "...";
    }
    if (currentPage == totalcount) {
        HTML += addButton(currentPage - 2, currentPage);
    }
    if (currentPage > 2) {
        HTML += addButton(currentPage - 1, currentPage);
    }
    if (currentPage != 1 && currentPage != totalcount) {
        HTML += addButton(currentPage, currentPage);
    }
    if (currentPage < totalcount - 1) {
        HTML += addButton(currentPage + 1, currentPage);
    }
    if (currentPage == 1) {
        HTML += addButton(currentPage + 2, currentPage);
    }
    if (currentPage < totalcount - 2) {
        HTML += "...";
    }
    if (totalcount > 1) {
        HTML += addButton(totalcount, currentPage);
    }
  }
  if (totalcount > 1) {
    HTML += '<li><a title="Next" href="javascript:void(0)" id="next-pg" class="D(f) M(3px)"><img src="/static/assets/imgs/feather-ico/arrow-left-solid.svg" class="Rotate(180deg) W(16px) H(a)" alt=""></a></li>';
  }

  document.getElementById("data-pagination").innerHTML = HTML;
}

  var xurl_string = window.location.href;
  var xurls = new URL(xurl_string);
  xsearch = xurls.searchParams.get("search");
  xstatus = xurls.searchParams.get("status");

  if (xsearch === null || xstatus === null)
  {
  }
  else
  {
    document.getElementById("status").value = xstatus;
    document.getElementById("search").value = xsearch;
  }


function addButton(number, currentPage) {
  var HTML = "";
  var search = null;
  var status = null;

  var url_string = window.location.href; //window.location.href
  var urls = new URL(url_string);
  search = urls.searchParams.get("search");
  status = urls.searchParams.get("status");

  if (search === null || status === null)
  {
    HTML = '<li><a  href="/admin/orders/home?pg=' + number + '"  ';
  }
  else 
  {
    HTML = '<li><a  href="/admin/orders/home?pg='+number+ '&search='+search+ '&status='+status+'"';
  }

  if (number == currentPage) {
     HTML += "class='M(3px) Py(8px) Px(16px) Bdrs(4px) class Pe(n) Op(0.5)'";
  } else {
    HTML += "class='M(3px) Py(8px) Px(16px) Bdrs(4px)'";
  }
  HTML += ">";
  HTML += number;
  HTML += "</a></li>";
  return HTML;
}

click_btn_search = function()
{
  document.getElementById('form').submit();
}

function changePage(prev, dotted, next) {
  if (prev) {
    if (start > 1) {
      start--;
      window.location.href = url + start
    }
  }
  if (next) {
    if (start < totalcount) {
      start++;
      window.location.href = url + start
    }
  }
}