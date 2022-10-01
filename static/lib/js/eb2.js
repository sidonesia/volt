// const file=document.getElementById("pic"),upContainer=document.querySelector("#picContainer"),editCon=document.querySelector("[data-edit-con]"),imgCon=document.querySelector("[data-show-img]"),imgCon2=document.querySelector("#image");let myCropper;function loadImg(srcEncoded,id){if(srcEncoded){const html=`\n    <div data-show-btn class="Cur(p) Pos(r) Mend(12px)">\n    <span title="Remove Image" id="" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>\n    <img id="picContainer" class="W(47px) H(47px) Mend(10px)" src="" alt="" />\n    </div>\n    `;imgCon.insertAdjacentHTML("afterbegin",html),file.nextElementSibling.style.display="none",document.getElementById("rm").value="0"}}MicroModal.init({onClose:modal=>{myCropper&&myCropper.destroy()},onShow:modal=>editCon.style.display="none"}),loadImg(img,"x"),file.addEventListener("change",(function(){const file=this.files[0];var FileSize;if(myCropper&&myCropper.destroy(),file&&file.type.startsWith("image/"))if(file.size/1024/1024>5)alert("File size exceeds 5 MB");else{editCon.style.display="block";const reader=new FileReader;reader.readAsDataURL(file),reader.onload=e=>{imgCon2.setAttribute("src",e.target.result),myCropper=new Cropper(image,{autoCropArea:1,viewMode:3,zoomable:!0,dragMode:"move",aspectRatio:1,background:!1,ready:function(){this.cropper.crop()}})}}})),document.querySelector("#submitBtn").addEventListener("click",e=>{e.preventDefault();const croppedimage=myCropper.getCroppedCanvas({maxWidth:300,maxHeight:300,fillColor:"#fff",imageSmoothingEnabled:!0,imageSmoothingQuality:"high"}).toDataURL("image/png");$('input[name="pic1"]').remove();var newinput=document.createElement("input");newinput.type="hidden",newinput.name="pic1",newinput.value=croppedimage,document.getElementById("form").appendChild(newinput),$('img[id="picContainer"]').remove(),loadImg(croppedimage,"x"),MicroModal.close("modal-2")}),document.querySelector("#resetBtn").addEventListener("click",e=>{myCropper.reset()}),imgCon.addEventListener("click",e=>{const t=e.target;t.classList.contains("ri")&&(id=$(t).attr("id"),t.parentElement.remove(),file.nextElementSibling.style.display="block",document.getElementById("rm").value="1")}),$(document).on("click","#dl",(function(e){var x;confirm("Are you sure want to delete this link? All the data associated with this link will be removed?")||e.preventDefault()}));

const file          = document.getElementById("pic");
const upContainer   = document.querySelector("#picContainer");
const editCon       = document.querySelector("[data-edit-con]");
const imgCon        = document.querySelector("[data-show-img]");
const imgCon2       = document.querySelector("#image");
const g_compress    = getConfig("G_IMAGE_CROP_COMPRESS", 1               )
const g_cont_type   = getConfig("G_IMAGE_CONTENT_TYPE" , "image/png"     )
const g_crop_conf   = getConfig("G_IMAGE_CROP_CONFIG"  , { minWidth: 256, minHeight: 256, maxWidth: 4096, maxHeight: 4096, fillColor: '#fff', imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
const g_thum_size   =  getConfig("G_IMAGE_THUM_SIZE" ,  { width: 150, height: 150 } )
let myCropper;

function loadImg(srcEncoded, id) {
    if (srcEncoded) {
        const html = `\n    <div data-show-btn class="Cur(p) Pos(r) Mend(12px)">\n    <span title="Remove Image" id="${id}" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>\n    <img id="picContainer" class="W(47px) H(47px) Mend(10px)" src="${srcEncoded}" alt="" />\n    </div>\n    `;
        imgCon.insertAdjacentHTML("afterbegin", html), file.nextElementSibling.style.display = "none", document.getElementById("rm").value = "0"
    }
};

MicroModal.init({
    onClose: modal => {
        myCropper && myCropper.destroy()
    },
    onShow: modal => editCon.style.display = "none"
});

loadImg(img, "x");

file.addEventListener("change", (function() {
    const file = this.files[0];
    var FileSize;
    if (myCropper && myCropper.destroy(), file && file.type.startsWith("image/"))
        if (file.size / 1024 / 1024 > 5) alert("File size exceeds 5 MB");
        else {
            editCon.style.display = "block";
            const reader = new FileReader;
            reader.readAsDataURL(file), reader.onload = e => {
                imgCon2.setAttribute("src", e.target.result), myCropper = new Cropper(image, {
                    autoCropArea: 1,
                    viewMode: 3,
                    zoomable: !0,
                    dragMode: "move",
                    aspectRatio: 1,
                    background: !1,
                    ready: function() {
                        this.cropper.crop()
                    }
                })
            }
        }
}));

document.querySelector("#submitBtn").addEventListener("click", e => {
    e.preventDefault();
    const croppedimage = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress) 
    $('input[name="pic1"]').remove();

    var newinput = document.createElement("input");
    newinput.type = "hidden", newinput.name = "pic1", newinput.value = croppedimage, document.getElementById("form").appendChild(newinput), $('img[id="picContainer"]').remove(), loadImg(croppedimage, "x"), MicroModal.close("modal-2")
    MicroModal.close('modal-thumbnail');

});

document.querySelector("#resetBtn").addEventListener("click", e => {
    myCropper.reset()
});

imgCon.addEventListener("click", e => {
    const t = e.target;
    t.classList.contains("ri") && (id = $(t).attr("id"), t.parentElement.remove(), file.nextElementSibling.style.display = "block", document.getElementById("rm").value = "1")
});

$(document).on("click", "#dl", (function(e) {
    var x;
    confirm("Are you sure want to delete this link? All the data associated with this link will be removed?") || e.preventDefault()
}));


// LOAD ICON TO BE SHOWED - TABLER ICONS
function loadIcon(e) {
    if (e) {
        const svg = document.querySelector('[name="icons"]:checked+label svg')    
        const s = new XMLSerializer().serializeToString(svg)
        const dataURL = window.btoa(s);
        loadImg(`data:image/svg+xml;base64,${dataURL}`, 'x');

        var newinput   = document.createElement("input")
        newinput.type  = 'hidden'
        newinput.name  = 'pic1'
        newinput.id    = 'x'
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
        
        MicroModal.close("modal-2");
        
    }
}
