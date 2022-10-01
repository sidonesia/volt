const file        = document.getElementById('pic'           ) 
const upContainer = document.querySelector('#picContainer'  )
const editCon     = document.querySelector('[data-edit-con]')
const imgCon2     = document.querySelector('#image'         )

$('.up2').hide()

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
    e.preventDefault()
    const croppedimage = myCropper.getCroppedCanvas({
      minWidth: 256,
      minHeight: 256,
      maxWidth: 300,
      maxHeight: 300,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    }).toDataURL("image/png") 
                  
    var newinput   = document.createElement("input")
    newinput.type  = 'hidden'
    newinput.name  = 'pic1'
    newinput.value =  croppedimage 

    document.getElementById('form').appendChild(newinput)
    upContainer.src = croppedimage;  

    $('.up1').hide()
    $('.up2').show()
    document.getElementById("btn_upl").style.display = "block";

    MicroModal.close('modal-2')
  })

  document.querySelector('#resetBtn').addEventListener('click', (e) => {  
    myCropper.reset()
  })
  