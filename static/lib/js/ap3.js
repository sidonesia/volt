const star         = document.querySelector('[data-star]'               )
const image        = document.getElementById('image'                    ) 
const fileCon      = document.getElementById('pic'                      )
const editCon      = document.querySelector('[data-edit-con]'           )
const imgCon       = document.querySelector('[data-img-con]'            )
const imgCon2      = document.querySelector('#image'                    )
const selectLabel  = document.querySelector('[data-label]'              )
const selectParent = document.querySelector('[data-parent]'             )
const selects      = document.querySelectorAll('[data-select] > label'  )
const onInput      = document.getElementById('on'                       )
const txtArea      = document.querySelector('[data-txt-area]'           )
const txtSub       = document.querySelector('[data-txt-sub]'            )
const title        = document.getElementById('title'                    )

// 
const g_compress   = getConfig("G_IMAGE_CROP_COMPRESS", 1               )
const g_cont_type  = getConfig("G_IMAGE_CONTENT_TYPE" , "image/png"     )
const g_crop_conf  = getConfig("G_IMAGE_CROP_CONFIG"  , { minWidth: 256, minHeight: 256, maxWidth: 4096, maxHeight: 4096, fillColor: '#fff', imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
const g_thum_size  =  getConfig("G_IMAGE_THUM_SIZE" ,  { width: 150, height: 150 } )

let counter        = 0
let myCropper  

var starToggle = ($('#on').is(":checked")) ? 'Fill(#707070)!' : 'Fill(#F8CD5B)!'
onInput.addEventListener('change', () => {
  star.querySelector('svg').classList.toggle(starToggle)   
})

// CATEGORY DROPDOWN
function find_sub_category(params) {  
  var category_value = params.value
  var base_url = '/physical_product/sub_category/list'
  
  $.ajax ({
      type: 'GET',
      url: `${base_url}?category_value=${category_value}`,
      success: function(response) {
        // CLEAN DROPDOWN
        var sub_category_select_html = document.getElementById("sub_category");
        sub_category_select_html.innerHTML = "";

        var sub_category_list = response.sub_category_list
        
        // POPULATE DROPDOWN
        for(var i = 0; i < sub_category_list.length; i++) {
            var el          = document.createElement("option");
            el.textContent  = sub_category_list[i]['name'];
            el.value        = sub_category_list[i]['value'];
            sub_category_select_html.appendChild(el);
        }
      }
  });
}


// IMAGE PROCESSING

document.getElementById("counter").value = counter
MicroModal.init({
  onClose: modal => { 
    myCropper&&myCropper.destroy()
  }, 
  onShow: modal => {
    editCon.style.display = 'none'
  }
})

document.querySelector('#btn_lm')&&document.querySelector('#btn_lm').addEventListener('click', (e) => {
  MicroModal.show('modal-1')
})

fileCon.addEventListener('click', (e) => {
  myCropper&&myCropper.destroy()
})

fileCon.addEventListener('change', function(){
  const file = this.files[0]          
  if (file && file.type.startsWith('image/')) {
    var FileSize = file.size / 1024 / 1024 // in MB
      if (FileSize > 5) {
        alert('File size exceeds 5 MB')
        fileCon.value = null;
      }else if (document.getElementById("counter").value == 5) {
        alert('you have reached the maximum limit for uploading images')
        fileCon.value = null;
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => { 
          imgCon2.setAttribute('src', e.target.result)  
          editCon.style.display = 'block'
          myCropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 3,
            zoomable: true,
            dragMode: 'move',
            aspectRatio: 1,
            background: false,
            ready: function(){
              this.cropper.crop()
            }          
          })  

        }
      }
  }                
}) 

document.querySelector('#submitBtn').addEventListener('click', (e) => {          
  e.preventDefault()
  const croppedimage = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress) 
  counter = counter + 1

  var newinput   = document.createElement("input")
  newinput.type  = 'hidden'
  newinput.id    = 'unsaved_' + counter
  newinput.name  = 'pic_list'
  newinput.value =  JSON.stringify({ data:  croppedimage, counter : counter })

  var newinput1   = document.createElement("input")
  newinput1.type  = 'hidden'
  newinput1.id    = 'unsaved_' + counter + "_"
  newinput1.name  = 'thumbnails'
  newinput1.value =  JSON.stringify({ data:  myCropper.getCroppedCanvas(g_thum_size).toDataURL(g_cont_type, g_compress), counter : counter })

  document.getElementById('form').appendChild(newinput)
  document.getElementById('form').appendChild(newinput1)
  loadImg(croppedimage, 'unsaved_' + counter)
  MicroModal.close('modal-2')
  fileCon.value = null;
})

document.querySelector('#resetBtn').addEventListener('click', (e) => {  
  myCropper.reset()
})

imgCon.addEventListener('click', (e) => {
  var count = document.getElementById("counter").value
  const t = e.target
  if(t.classList.contains('ri')) {
    id  = $(t).attr("id")
    id2 = id + "_"
    count = count - 1
    document.getElementById("counter").value = count
    $(`input[id="${id}"]`).remove()    
    $(`input[id="${id2}"]`).remove()   
    t.parentElement.remove()
  }
})

// LOAD ICON TO BE SHOWED - TABLER ICONS
function loadIcon(e) {
  if (e) {
      const svg = document.querySelector('[name="icons"]:checked+label svg')    
      const s = new XMLSerializer().serializeToString(svg)
      const dataURL = window.btoa(s);
      var croppedimage = `data:image/svg+xml;base64,${dataURL}`
      counter = counter + 1

      var newinput   = document.createElement("input")
      newinput.type  = 'hidden'
      newinput.id    = 'unsaved_' + counter
      newinput.name  = 'pic_list'
      newinput.value =  JSON.stringify({ data:  croppedimage, counter : counter, svgId: e, svgColor: $('[data-text]').val() })

      var newinput1   = document.createElement("input")
      newinput1.type  = 'hidden'
      newinput1.id    = 'unsaved_' + counter + "_"
      newinput1.name  = 'thumbnails'
      newinput1.value =  JSON.stringify({ data:  croppedimage, counter : counter, svgId: e, svgColor: $('[data-text]').val() })

      document.getElementById('form').appendChild(newinput);
      document.getElementById('form').appendChild(newinput1);
      loadImg(croppedimage, 'unsaved_' + counter);
      MicroModal.close('modal-2');
      MicroModal.close('modal-thumbnail');
      fileCon.value = null;
  }
}

// END IMAGE PROCESSING

txtSub.addEventListener('keyup', (e) => {     
  txtArea.innerHTML = e.target.innerHTML
})

$('#base_price').focusout((e)=>{
  val = $(e.target).val()
  if (!val) {
    document.getElementById('base_price').value = 0
    $('#base_price').removeClass('Td(lt)')
  }
  if (val >= 0 && $("#sale_price").val()) {
    $('#base_price').addClass('Td(lt)')
  } else {
    $('#base_price').removeClass('Td(lt)')
  }
})

$('#sale_price').focusout((e)=>{
  setStrikeThrough()
})

$('#minimum_price, #suggested_price').focusout((e)=>{
  val = $(e.target).val()
  if (!val) {
    e.target.value = 0
  }
})

$('input[name=on2]').change(function() {
  if ($(this).is(':checked')) {
    document.getElementById("disp_act").innerHTML = "Display Active"
  } else {
    document.getElementById("disp_act").innerHTML = "Display Inactive"
  }
})

jQuery.validator.addMethod("special", function (value, element) {
  return parseInt(document.getElementById("slug_available").value) == 0
})

$('#form').validate({
  ignore: ":hidden:not(#pkey),[contenteditable='true']:not([name])",
  onblur: true,
  onkeyup: false,
  onfocusout: function(element) {
    this.element(element)
  },
  rules: {
      "title": {
        required: true,
        special: true,
      },
      "base_price": {
        required: true,
      },
      "content_url": {
        required: true,
      }
  },
  messages: {
      "title": {
        required: "Please enter Title",
        special: "Input title is already being used",
      },
      "base_price": {
        required: "Please enter Price",
      },
      "content_url": {
        required: "Please enter Url",
      }
  },
  submitHandler: function(form) { 
    var params = $(form).serialize();

    const courseData = collectCourse();
    if (!courseData) {return !1;}
    document.querySelector('.loading').classList.remove('D(n)');
    if (typeof courseData !== 'undefined'){
        params += "&" + $.param({ course: JSON.stringify(courseData) }, true);
    }

    if(typeof addons !== 'undefined'){
      params += "&" + $.param({ addons: JSON.stringify(addons) }, true);
    }
    if(typeof variance !== 'undefined' && typeof variancePermutation !== 'undefined'){
      params += "&" + $.param({ variance: JSON.stringify(variance) }, true) + "&" + $.param({ variance_permutate: variancePermutation }, true);
    }
    $.ajax ({
        type: 'POST',
        url: '/process/my-products/add',
        data: params,
        success: function(response) {
          var version_val = parseInt(navigator.appVersion)
          if (version_val>=4 || window.location.replace) {
            window.location.replace('/admin/my-lynks/home');
          } else {
            window.location.href = '/admin/my-lynks/home';
          }
        }
    });
  },
  invalidHandler: function(form, validator) {
      var errors = validator.numberOfInvalids()
      if (errors) {
          $("html, body").animate({
              scrollTop: $(validator.errorList[0].element).offset().top-500
          }, 500)
      }
  }
})

selectLabel.addEventListener('click', (e) => {
  selectParent.classList.toggle('D(n)')      
})      

selects.forEach(select => {
  select.addEventListener('click', (e) => {  
    const text = select.innerText
    document.querySelector('[data-text-action]').innerText = text
    selectParent.classList.add('D(n)')
  })
})

$('#base_price, #sale_price, #minimum_price, #suggested_price').on("keypress keyup blur",function (event) {    
  $(this).val($(this).val().replace(/[^\d].+/, ""));
  if ((event.which < 48 || event.which > 57)) {
      event.preventDefault();
  }
})
$('#title').on('focusin focusout', function(e) { slug_checker() });
function slug_checker() { document.getElementById("slug_available").value = getURL('/my-products/slug/check', { pkey: document.getElementById('pkey').value, title: title.value }).count }

function setStrikeThrough() {
  if ($('#sale_price').val() && $("#base_price").val()) {
    $('#base_price').addClass('Td(lt)')
  } else {
    $('#base_price').removeClass('Td(lt)')
  }
}

function loadImg(srcEncoded, id) {  
  if (srcEncoded) {
    const html = `
      <div class="Pos(r) D(ib) Mx(2px)">
        <span title="Remove Image" id="${id}" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>
        <img class="W(73px) H(70px) Bdrs(4px) Ov(h)" src="${srcEncoded}" alt="">
      </div>
    `
    const imgCon = document.querySelector('[data-img-con]')         
    imgCon.insertAdjacentHTML('afterbegin', html) 
    let count = document.getElementById("counter").value
    document.getElementById("counter").value = parseInt(count) + 1
  } 
}

function collectCourse(){
  if (document.getElementsByName("product_type")[0].value != 'course') {
   return 1;
  }
  const data = {}
  const chapterList = [];
  const parent = document.querySelector(`[data-content-list]`);

  if (parent) {
      const children = parent.querySelectorAll(`[data-single-content]`);
      let i;
      let j;
  
      children.forEach(function(e){
        i = {};
        const cTitleEl = e.querySelector('[data-single-content-title]');
        i.pid = cTitleEl.id;
        i.title = cTitleEl.value;
        i.description =  e.querySelector('#description').innerHTML;
        i.data = [];
    
        var contents = e.querySelectorAll(`[data-content]`);
        contents.forEach(function(f){
            var hs = f.querySelectorAll('[data-remove-el2]');
            hs.forEach(function(g){
              j = {};
              j.pid = g.id;
              j.id = g.querySelector('[data-id]').innerHTML;
              j.title = g.querySelector('[data-video-title]').innerHTML;
              j.subTitle = g.querySelector('[data-video-sub]').innerHTML;
              j.desc = g.querySelector('[data-video-desc]').innerHTML;

              i.data.push(j);
            });
        });
        chapterList.push(i);
      });

      data.intendedLearning = getCourseDataJson('data-intended-learning');
      data.prerequisites = getCourseDataJson('data-prerequisites');
      data.intendedLearner = getCourseDataJson('data-intended-learner');
      data.chapter = chapterList;

      const il1 = data.intendedLearning;
      if (!il1.length) {
        alert("Intended learning cannot be empty");
        return !1;
      }
      for (const [i, e] of il1.entries()) {
        if (!e.value){
          const eil1E = document.querySelector(`#e-${e.pid}`);
          eil1E.textContent = "This Field is required"
          return !1;
        }
      }

      const il2 = data.prerequisites
      if (!il2.length) {
        alert("Prerequisites cannot be empty");
        return !1;
      }
      for (const [i, e] of il2.entries()) {
        if (!e.value){
          const eil1E = document.querySelector(`#e-${e.pid}`);
          eil1E.textContent = "This Field is required";
          return !1;
        }
      }

      const il3 = data.intendedLearner;
      if (!il3.length) {
        alert("Intended learner cannot be empty");
        return !1;
      }

      for (const [i, e] of il3.entries()) {
        if (!e.value){
          const eil1E = document.querySelector(`#e-${e.pid}`);
          eil1E.textContent = "This Field is required";
          return !1;
        }
      }

      const il4 = data.chapter;
      if (!il4.length) {
        alert("Chapter cannot be empty");
        return !1;
      }

      for (const [i, e] of il4.entries()) {
        const er1Lbl = document.querySelector(`#e-${e.pid}`);
        er1Lbl.textContent = '';
        if (!e.title) {
          er1Lbl.textContent = "This Field is required";
          return !1;
        }

        const eData = e.data;
        if (!eData.length) {
          alert("Chapter content cannot be empty");
          return !1;
        }
        for (const [i, g] of eData.entries()) {
          const erLbl1 = document.querySelector(`#ei-${g.pid}`);
          const erLblT = document.querySelector(`#et-${g.pid}`);
          const erLblS = document.querySelector(`#es-${g.pid}`);
          erLbl1.textContent = '';
          erLblT.textContent = '';
          erLblS.textContent = '';
          if (!g.id){
            erLbl1.textContent = 'Please Select the file';
            return !1;
          }
          if (!g.title){
            erLblT.textContent = 'This Field is required';
            return !1;
          }
          if (!g.subTitle){
            erLblS.textContent = 'This Field is required';
            return !1;
          }
        };

      }
 
  }
  return data;
}

function getCourseDataJson(p){const data=[];const parent=document.querySelector(`[${p}]`);const children=parent.querySelectorAll(`[data-details]`);children.forEach(function(e,i){data.push({pid:e.id,value:e.value})});return data;}
