const file = document.getElementById('pic');
const upContainer = document.querySelector('#picContainer');    
$('.up2').hide()
file.addEventListener('change', function(){
const file = this.files[0]    
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
        
            $('.up1').hide()
            $('.up2').show()
            document.getElementById("btn_upl").style.display = "block";
            upContainer.src = srcEncoded;   
        }
        }
    
    }
};
})   