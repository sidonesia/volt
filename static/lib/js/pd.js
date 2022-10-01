if(v1){
p = v1.base_price
sPrice = v1.sale_price
} 
document.querySelector('[data-txt-sub]').insertAdjacentHTML('afterbegin', dsc);
var maxheight = 45;
var showText = 'Read More';
var hideText = 'Read Less';
$('.readmore-btn').each(function () {
    var _0x6a22x4 = $(this);
    if (_0x6a22x4.height() > maxheight) {
        _0x6a22x4.css({
            overflow: 'hidden',
            height: maxheight + 'px'
        });
        var _0x6a22x5 = $('<a class="Fz(12px) Fw(600)" href="#" style="color: #2AB57D;">' + showText + '</a>');
        var _0x6a22x6 = $('<div class="Ta(c)"></div>');
        _0x6a22x6.append(_0x6a22x5);
        $(this).after(_0x6a22x6);
        _0x6a22x5.click(function (_0x6a22x5) {
            _0x6a22x5.preventDefault();
            if (_0x6a22x4.height() > maxheight) {
                $(this).html(showText);
                _0x6a22x4.css('height', maxheight + 'px')
            } else {
                $(this).html(hideText);
                _0x6a22x4.css('height', 'auto')
            }
        })
    }
});
strikethrough_price(sPrice);
$.each(v1.combination_arr, function(key,val) {
    document.getElementById(v[key].name+"|"+val).checked = true;
    document.getElementsByName(v[key].name+'-tag')[0].value = val
});
$.each(v, function(key,val) {
    var group = "input:checkbox[name='" + val.name + "']"
    $(document).on('click', group, function(e) {     
        checked = $(group+":checked").length;
        if(!checked) {
            return false;
        }
        $(group).not(this).prop('checked', false);    
        document.getElementsByName(e.target.name+'-tag')[0].value = e.target.id.split('|')[1]
        const idx = document.getElementById(e.target.name+'idx').value
    });
});

function pickChoose(e) {
    e.preventDefault();
    const vt = document.querySelectorAll('[data-var-tag]');
    let iU = '';
    let combination = '';
    let actv = false;
    let bPrice1 = 0;
    let sPrice1 = 0;
    let sStock  = 0;
    vt.forEach( function(e, element) {iU += e.value + '-';});
    $.each(v2, function(i, v) { if (v.combination == iU.slice(0,-1)) { combination = v.combination; actv = v.is_active; bPrice1 = v.base_price; sPrice1 = v.sale_price; sStock = v.stock; return; } });
    if (!actv){alert("This Variant combination is not available"); MicroModal.close('modal-variant'); return; };vt.forEach( function(e, element) { document.getElementById(element+'lbl').innerText = e.value;});
    $(`input[name="variance_combination"]`).remove();var n = document.createElement("input");n.type = "hidden";n.name = "variance_combination";n.value = combination;document.getElementById("form").appendChild(n);
    if (document.querySelector('[data-price-tag]')){document.querySelector('[data-price-tag]').innerHTML = '';};strikethrough_price(sPrice1);
    if (document.getElementById('price_tag')){document.getElementById('price_tag').innerHTML = curr + ' ' + nfFormatter(bPrice1)};
    if (sPrice1 && sPrice1 > 0) {document.getElementById('sale_price_tag').innerHTML = curr + ' ' + nfFormatter(sPrice1)};MicroModal.close('modal-variant');
    if (document.querySelector('[data-var-stock]')){document.querySelector('[data-var-stock]').innerHTML = sStock + ' Left';}
    if(sStock>0){
        document.querySelector('.sav').innerHTML = `<button class="Trs($c1) C(#ffffff) Fw(700) Cur(p) Scale(1.03):h Py(15px) D(b) W(100%) Bdrs(7px) O(n) Bd(n) Bg($c1) Fz(16px) Mend(16px)" data-next-step onclick="sp.addToCart.step1(event);">BUY</button>                                      
        <div onclick="sp.addToCart.showModal1(event);" class="Py(12px) Px(13px) D(ib) shopping-cart Bdrs(4px) Cur(p)">
          <img src="/static/assets/imgs/feather-ico/shopping-cart.svg" alt="">
        </div>`;
    } else {
        document.querySelector('.sav').innerHTML = `<button class="Trs($c1) C(#ffffff) Fw(700) Cur(p) Scale(1.03):h Py(15px) D(b) W(100%) Bdrs(7px) O(n) Bd(n) Bgc(#707070) Fz(16px) Mend(16px)" onclick="return false;">Product not available</button>                                     
        <div onclick="sp.addToCart.showModal1(event);" class="Py(12px) Px(13px) D(ib) shopping-cart Bdrs(4px) Cur(p)">
          <img src="/static/assets/imgs/feather-ico/shopping-cart.svg" alt="">
        </div>`;
    }
}

function strikethrough_price(_0x6a22x5) {
    const _0x6a22x4 = `${''}${`${`<h6 class="C($green) Fw(700) Fz(15px) My(2px)" style="overflow-wrap: break-word;word-wrap: break-word;overflow: hidden;color: {{ form.product_template.font_color }};" id='price_tag'></h6><button type="button" title="Copy to Clipboard" class="Cur(p) Scale(1.1):h D(f) Maw(maxc) Bd(n) Bg(n) As(fe) Mt(8px) Mend(8px)" id='cp1btn' ><img class="W(16px) H(a)" src="/static/assets/imgs/feather-ico/share-option.svg" alt=""></button>`}`}${''}`;
    const _0x6a22x6 = `${''}${`${`<h6 class="C($green) Fw(700) Fz(15px) Td(lt) My(2px)" style="overflow-wrap: break-word;word-wrap: break-word;overflow: hidden;" id='price_tag'></h6><h6 class="C($green) Fw(700) Fz(15px) My(2px)" style="overflow-wrap: break-word;word-wrap: break-word;overflow: hidden;"  id='sale_price_tag'></h6><button type="button" title="Copy to Clipboard" class="Cur(p) Scale(1.1):h D(f) Maw(maxc) Bd(n) Bg(n) As(fe) Mt(8px) Mend(8px)" id='cp1btn' ><img class="W(16px) H(a)" src="/static/assets/imgs/feather-ico/share-option.svg" alt=""></button>`}`}${''}`;
    document.querySelector('[data-price-tag]') && document.querySelector('[data-price-tag]').insertAdjacentHTML('afterbegin', _0x6a22x5&&_0x6a22x5>0 ? _0x6a22x6 : _0x6a22x4)
}
if (document.getElementById('price_tag')) {
    document.getElementById('price_tag').innerHTML = curr + ' ' + nfFormatter(p)
};
if (sPrice && sPrice > 0 && document.getElementById('sale_price_tag')) {
    document.getElementById('sale_price_tag').innerHTML = curr + ' ' + nfFormatter(sPrice)
};

function kFormatter(_0x6a22x5) {
    if (_0x6a22x5) {
        return Math.abs(_0x6a22x5) > 999 ? Math.sign(_0x6a22x5) * (Math.abs(_0x6a22x5) / 1e3) + 'K' : Math.sign(_0x6a22x5) * Math.abs(_0x6a22x5)
    } else {
        return 0
    }
}

function nfFormatter(val) {
    if (val) {
        let nf = new Intl.NumberFormat('en-US');
        return nf.format(val);
    } else {
        return val;
    };
}

$('#cp1btn').click(function () {
    if (!slug_id) {
        url = window.location.href
    } else {
        url = RemoveLastDirectoryPartOf(window.location.href) + '/' + slug_id
    };
    copyToClipboard(url);
    showAToast('Copied!')
});

function RemoveLastDirectoryPartOf(_0x6a22x5) {
    var _0x6a22x4 = _0x6a22x5.split('/');
    _0x6a22x4.pop();
    return _0x6a22x4.join('/')
}
