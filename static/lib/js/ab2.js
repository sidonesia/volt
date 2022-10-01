const file        = document.getElementById('pic'            ) 
const upContainer = document.querySelector('#picContainer'   )
const editCon     = document.querySelector('[data-edit-con]' )
const imgCon      = document.querySelector('[data-show-img]' )
const imgCon2     = document.querySelector('#image'          )

const g_compress   = getConfig("G_IMAGE_CROP_COMPRESS", 1               )
const g_cont_type  = getConfig("G_IMAGE_CONTENT_TYPE" , "image/png"     )
const g_crop_conf  = getConfig("G_IMAGE_CROP_CONFIG"  , { minWidth: 256, minHeight: 256, maxWidth: 4096, maxHeight: 4096, fillColor: '#fff', imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
const g_thum_size  =  getConfig("G_IMAGE_THUM_SIZE" ,  { width: 150, height: 150 } )

let myCropper  
MicroModal.init({
  onClose: modal => { myCropper ? myCropper.destroy() : '' }, 
  onShow: modal => editCon.style.display = 'none',
})  

file.addEventListener('change', function(){
    const file = this.files[0]              
    myCropper ? myCropper.destroy() : ''
    if (file && file.type.startsWith('image/')) {
      var FileSize = file.size / 1024 / 1024 // in MB
        if (FileSize > 5) {
          alert('File size exceeds 5 MB')
        }else {
          editCon.style.display = 'block'
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e) => { 
            imgCon2.setAttribute('src', e.target.result)  
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
    const croppedimage = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress) 
    $('input[name="pic1"]').remove()
    
    var newinput   = document.createElement("input")
    newinput.type  = 'hidden'
    newinput.name  = 'pic1'
    newinput.id    = 'picContainer_'
    newinput.value =  croppedimage 

    document.getElementById('form').appendChild(newinput)
    if (document.getElementById('image_type')) {
      document.getElementById('image_type').value = "image"
    }
    $('img[id="picContainer"]').remove()
    loadImg(croppedimage, 'picContainer_')
    MicroModal.close('modal-2')
    MicroModal.close('modal-thumbnail');
  })

  document.querySelector('#resetBtn').addEventListener('click', (e) => {  
    myCropper.reset()
  })
 
  function loadImg(srcEncoded, id) {  
    if (srcEncoded) {
      const html = `
      <div data-show-btn class="Cur(p) Pos(r) Mend(12px)">
      <span title="Remove Image" id="${id}" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>
      <img id="picContainer" class="W(47px) H(47px) Mend(10px)" src="${srcEncoded}" alt="" />
      </div>
      `  
      imgCon.insertAdjacentHTML('afterbegin', html) 
      file.nextElementSibling.style.display = 'none'  
      
    } 
  }

  imgCon.addEventListener('click', (e) => {
    const t = e.target
    if(t.classList.contains('ri')) {
      id  = $(t).attr("id")
      t.parentElement.remove();
      file.nextElementSibling.style.display = 'block';
      $(`input[id="${id}"]`).remove()    
    }
  })

// LOAD ICON TO BE SHOWED - TABLER ICONS
function loadIcon(e) {
  const svg = document.querySelector('[name="icons"]:checked+label svg')    
  const s = new XMLSerializer().serializeToString(svg)
  const dataURL = window.btoa(s);
  loadImg(`data:image/svg+xml;base64,${dataURL}`, 'picContainer_');

  var newinput   = document.createElement("input")
  newinput.type  = 'hidden'
  newinput.name  = 'pic1'
  newinput.id    = 'picContainer_'
  newinput.value = `data:image/svg+xml;base64,${dataURL}`
  document.getElementById('form').appendChild(newinput)
  if (document.getElementById('image_type')) {
    document.getElementById('image_type').value = "svg"
  }

  var newinput   = document.createElement("input")
  newinput.type  = 'hidden'
  newinput.name  = 'svgId'
  newinput.id    = 'svgId_'
  newinput.value = e
  document.getElementById('form').appendChild(newinput)
  var newinput   = document.createElement("input")
  newinput.type  = 'hidden'
  newinput.name  = 'svgColor'
  newinput.id    = 'svgColor_'
  newinput.value = $('[data-text]').val()
  document.getElementById('form').appendChild(newinput)

}

