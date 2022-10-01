// Img upload
// select all input file
const files = document.querySelectorAll('[data-img-input]');                         

files.forEach(fileInput => {
  // for each input type file
  fileInput.addEventListener('change', function(){
    const file = this.files[0];                    
    if (file && file.type.startsWith('image/')) {
      var FileSize = file.size / 1024 / 1024; // in MB
      if (FileSize > 5) {
        alert('File size exceeds 5 MB')
      } else {

        const reader = new FileReader()
        reader.fileName = file.name
        reader.readAsDataURL(file);
        reader.onload = function (e) {

          const imgElement = document.createElement("img");
          imgElement.src = e.target.result;
          imgElement.onload = function(e){
        
            const canvas = document.createElement("canvas")
            const MAX_WIDTH = 300

            const scaleSize = MAX_WIDTH / e.target.width
            canvas.width = MAX_WIDTH
            canvas.height = MAX_WIDTH

            const ctx = canvas.getContext("2d")
            ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height)
            
            const srcEncoded = ctx.canvas.toDataURL("image/jpeg")
            $('input[name="pic1"]').remove()
      
            var newinput   = document.createElement("input")
            newinput.type  = 'hidden'
            newinput.name  = 'pic1'
            newinput.value = srcEncoded
            
            document.getElementById('form').appendChild(newinput)

            const html = `
            <div data-show-btn class="Cur(p) Pos(r) Mend(12px)">
              <span data-remove-img title="Remove Image" class="Cur(p) ri Pos(a) End(-3px) T(-6px) Fz(8px) D(f) Jc(c) Ai(c) W(15px) H(15px) Bdrs(50%) Lh(10px) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>                  
              <img  class="W(51px) H(37px) Ov(h) Bdrs(4px)" src="${srcEncoded}" alt="" style="width:47px;height:47px">
            </div>
            `; 
            
            const con = fileInput.closest('[data-show-img]');              
            con.insertAdjacentHTML('afterbegin', html);   
            fileInput.nextElementSibling.style.display = 'none'             
          
            const removeImgBtn = document.querySelectorAll('[data-remove-img]');                             
            removeImgBtn.forEach(btn => {

              btn.addEventListener('click', (e) => {
                const t = e.target;
                if(t.classList.contains('ri')) {
                  t.parentElement.remove();
                  fileInput.nextElementSibling.style.display = 'block';             
                };             
              });
            });

          }
        }
      }
    };                      
  }); 
})