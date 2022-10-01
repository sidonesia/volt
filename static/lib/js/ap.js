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

let counter        = 0
let myCropper  


var starToggle = ($('#on').is(":checked")) ? 'Fill(#707070)!' : 'Fill(#F8CD5B)!'
onInput.addEventListener('change', () => {
  star.querySelector('svg').classList.toggle(starToggle)   
})

document.getElementById("counter").value = counter
MicroModal.init({
  onClose: modal => { 
    myCropper.destroy()
  }, 
  onShow: modal => {
    editCon.style.display = 'none'
  }
})

document.querySelector('#btn_lm').addEventListener('click', (e) => {
  MicroModal.show('modal-1')
})

fileCon.addEventListener('click', (e) => {
  myCropper.destroy()
})

fileCon.addEventListener('change', function(){
  const file = this.files[0]              
  if (file && file.type.startsWith('image/')) {
    var FileSize = file.size / 1024 / 1024 // in MB
      if (FileSize > 5) {
        alert('File size exceeds 5 MB')
      }else if (document.getElementById("counter").value == 5) {
        alert('you have reached the maximum limit for uploading images')
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
  const croppedimage = myCropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  }).toDataURL("image/png") 
 
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
  newinput1.value =  JSON.stringify({ data:  myCropper.getCroppedCanvas({ width: 150, height: 150}).toDataURL("image/png"), counter : counter })

  document.getElementById('form').appendChild(newinput)
  document.getElementById('form').appendChild(newinput1)
  loadImg(croppedimage, 'unsaved_' + counter)
  MicroModal.close('modal-2')
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
  ignore: "",
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
    document.querySelector('.loading').classList.remove('D(n)');
    var params = $(form).serialize();
    $.ajax ({
        type: 'POST',
        url: '/process/my-products/add',
        data: params,
        success: function(response) {
          window.location.replace('/admin/my-lynks/home')             
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
    document.querySelector('[data-text]').innerText = text
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