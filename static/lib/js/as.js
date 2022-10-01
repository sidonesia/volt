function slug_checker() {
    document.getElementById("slug_available").value = getURL("/my-donation/slug/check", {
        pkey: document.getElementById("pkey").value,
        title: document.getElementById("title").value
    }).count
}
$("#base_price").on("keypress keyup blur", (function(event) {
    $(this).val($(this).val().replace(/[^\d].+/, "")), (event.which < 48 || event.which > 57) && event.preventDefault();
}));
$("#title").on("focusin focusout", (function(e) {
    slug_checker();
}));
jQuery.validator.addMethod("special", (function(value, element) {
    return 0 == parseInt(document.getElementById("slug_available").value);
}));
$("#form").validate({
    ignore: "",
    onblur: !0,
    onkeyup: !1,
    onfocusout: function(element) {
        this.element(element)
    },
    rules: {
        title: {
            required: !0,
            special: !0
        }
    },
    messages: {
        title: {
            required: "Please enter Title",
            special: "Input title is already being used"
        }
    },
    submitHandler: function(form) {
        document.querySelector(".loading").classList.remove("D(n)");
        var params = $(form).serialize();

        $.ajax({
            type: "POST",
            url: "/process/my-products/support/add",
            data: params,
            success: function(response) {
                var fk_page_id = form.fk_page_id.value;
                window.location.href = '/admin/my-lynks/' + fk_page_id; 
            }
        })
    },
    invalidHandler: function(form, validator) {
        var errors;
        validator.numberOfInvalids() && $("html, body").animate({
            scrollTop: $(validator.errorList[0].element).offset().top - 500
        }, 500)
    }
});



/* IMAGE PROCESSING FROM GCROPPER */

const image = document.getElementById("image");
const fileCon = document.getElementById("pic");
const editCon = document.querySelector("[data-edit-con]");
const imgCon = document.querySelector("[data-img-con]");
const imgInputCon = document.querySelector("[data-img-input]");
const imgCon2 = document.querySelector("#image");
const g_compress = getConfig("G_IMAGE_CROP_COMPRESS", 1);
const g_cont_type = getConfig("G_IMAGE_CONTENT_TYPE", "image/png");
const g_crop_conf = getConfig("G_IMAGE_CROP_CONFIG", {
        minWidth: 256,
        minHeight: 256,
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: "#fff",
        imageSmoothingEnabled: !0,
        imageSmoothingQuality: "high"
    })
const g_thum_size = getConfig("G_IMAGE_THUM_SIZE", {
        width: 150,
        height: 150
    });

let myCropper;

// ADD IMAGE TO THE HTML
function loadImg(e) {
    // e = source of image
    if (e) {
        const t = `<div class="Pos(r) D(ib) Mx(2px)"><span title="Remove Image" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span><img style="height: 70px;width:70px" class="Bdrs(4px) Ov(h)" src="${e}" alt=""></div>`;
        imgCon.insertAdjacentHTML("afterbegin", t);
 
        imgInputCon.classList.add("D(n)");
    }
};

// INITIALIZE MICROMODAL
MicroModal.init({
    onClose: e => {
        myCropper && myCropper.destroy()
    },
    onShow: e => {
        editCon.style.display = "none"
    }
});

// UNKNOWN
fileCon.addEventListener("click", e => {
    myCropper && myCropper.destroy()
});



fileCon.addEventListener("change", function() {
    const e = this.files[0];
    if (e && e.type.startsWith("image/"))
        if (e.size / 1024 / 1024 > 5) alert("File size exceeds 5 MB");
    else {
        const t = new FileReader;
        t.readAsDataURL(e), t.onload = (e => {
            imgCon2.setAttribute("src", e.target.result), editCon.style.display = "block", myCropper = new Cropper(image, {
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
        })
    }
});

// WHEN SUBMIT IS PRESSED
document.querySelector("#submitBtn").addEventListener("click", e => {
    e.preventDefault();
    const image_base64 = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress);
    var image_input = document.createElement("input");
    image_input.type = "hidden";
    image_input.id ="pic_list";
    image_input.name = "pic_list";
    image_input.value = JSON.stringify({
        data: image_base64
    });

    document.getElementById("form").appendChild(image_input);
    imgInputCon.classList.add("D(n)");
    loadImg(image_base64);
    MicroModal.close("modal-thumbnail");
    MicroModal.close("modal-2");
    fileCon.value = null
});

document.querySelector("#resetBtn").addEventListener("click", e => {
    myCropper.reset()
});


// WHEN X IS PRESSED
imgCon.addEventListener("click", e => {
    const n = e.target;
    if(document.getElementById("pic_list")){
        document.getElementById("pic_list").remove()
    }

    if(n.classList.contains('ri')) {
        id  = $(n).attr("id")
        id2 = id + "_"

        $(`input[id="${id}"]`).remove()    
        $(`input[id="${id2}"]`).remove() 

        n.parentElement.remove();
        imgInputCon.classList.remove("D(n)");
        fileCon.value = "";  
    }

    // n.classList.contains("ri") && (id = $(n).attr("id"), id2 = id + "_", $(`input[id="${id}"]`).remove(), $(`input[id="${id2}"]`).remove(), n.parentElement.remove(), imgInputCon.classList.remove("D(n)"), fileCon.value = "")
});

// LOAD ICON TO BE SHOWED - TABLER ICONS
function loadIcon(e) {
    if (e) {
        const svg = document.querySelector('[name="icons"]:checked+label svg')    
        const s = new XMLSerializer().serializeToString(svg)
        const dataURL = window.btoa(s);
        var croppedimage = `data:image/svg+xml;base64,${dataURL}`
        loadImg(croppedimage);
        
        var image_input     = document.createElement("input");
        image_input.type    = "hidden";
        image_input.id      = "pic_list";
        image_input.name    = "pic_list";
        image_input.value   = JSON.stringify({
              data: croppedimage , svgId: e, svgColor: $('[data-text]').val()
        });
        document.getElementById("form").appendChild(image_input)
    }
  }