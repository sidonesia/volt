var elm         = $('#shipping_areas');
var elm2        = $('#shipping_methods');
var cbaa        = $('#areas');
var cbam        = $('#methods');
const els       = document.querySelectorAll('[data-input-parent]');
const elInputs  = document.querySelectorAll('[data-el-input]');  
let ppConfig    = { placeholder: "Please select", data: provinces, allowClear: true, multiple: true, width: "100%" };

$(elm).select2(ppConfig).change(function () {
    $(cbaa).prop("checked", (provinces.length == $(elm).select2("data").length) ? !0 : !1);
});

$(elm2).select2({ placeholder: "Please select", data: logistic, allowClear: true, multiple: true, width: "100%" }).change(function () {
    $(cbam).prop("checked", (logistic.length == $(elm2).select2("data").length) ? !0 : !1);
});

(typeof sprovince!=='undefined')&&$.each(sprovince, function(key, value) {   
    $(elm).append($("<option selected ></option>").attr("value", value.id).text(value.text)); 
});

(typeof slogistic!=='undefined')&&$.each(slogistic, function(key, value) {   
    $(elm2).append($("<option selected ></option>").attr("value", value.id).text(value.text)); 
});

els.forEach(el => {
  const elInput = el.querySelector('[data-el-input]')  ;   
  elInput.addEventListener('change', (e) => {
    const select2Id = '#shipping_' + e.target.id;
    const data      = (e.target.id == 'areas') ? provinces : logistic;
    ppConfig.data   = [];
    $(select2Id).html('').select2(ppConfig);
    
    if (e.target.checked) {
        $(el.previousElementSibling).hide();
        $.each(data, function(key, value) {   
            $(select2Id).append($("<option selected ></option>").attr("value", value.id).text(value.text)); 
        });
        
    }else {
        $(el.previousElementSibling).show();
        ppConfig.data = data;
        $(select2Id).html('').select2(ppConfig);
        
    };
  });
});
elInputs.forEach(input => {
  const parent = input.closest('[data-input-parent]')
  input.checked ? $(parent.nextElementSibling).hide() : $(parent.nextElementSibling).show()
});

if (typeof cbo_all_method!='undefined'&&cbo_all_method == 'checked'){$(cbam).trigger('click')};
if (typeof cbo_all_area!='undefined'&&cbo_all_area == 'checked'){$(cbaa).trigger('click')};