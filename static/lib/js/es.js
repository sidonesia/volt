function slug_checker() {
	document.getElementById("slug_available").value = getURL("/my-donation/slug/check", {
		pkey: document.getElementById("pkey").value,
		title: document.getElementById("title").value
	}).count
}
$("#base_price").on("keypress keyup blur", (function(event) {
	$(this).val($(this).val().replace(/[^\d].+/, "")), (event.which < 48 || event.which > 57) && event.preventDefault()
})), slug_checker(), $("#title").on("focusin focusout", (function(e) {
	slug_checker()
})), jQuery.validator.addMethod("special", (function(value, element) {
	return 0 == parseInt(document.getElementById("slug_available").value)
})), $("#form").validate({
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
			url: "/process/my-donatin/update",
			data: params,
			success: function(response) {
				window.location.replace("/admin/my-lynks/home")
			}
		})
	},
	invalidHandler: function(form, validator) {
		var errors;
		validator.numberOfInvalids() && $("html, body").animate({
			scrollTop: $(validator.errorList[0].element).offset().top - 500
		}, 500)
	}
}), $("#btn_dp").click((function(e) {
	confirm("Are you sure want to delete this link? All the data associated with this link will be removed?") ? ($("#form2").attr("action", "/process/my-donation/delete"), document.getElementById("form2").submit()) : e.preventDefault()
}));




// IMAGE PROCESS
const file			= document.getElementById("pic");
const editCon     	= document.querySelector("[data-edit-con]");
const imgCon      	= document.querySelector("[data-show-img]");
// const imgInputCon   = document.querySelector("[data-img-input]");
const imgCon2     	= document.querySelector("#image");

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
    
var update_img		= document.getElementById("update_img");

let myCropper;

/* 
	update_img 
 		0 = not updated, 1 = reset, 2 = new image
*/


MicroModal.init({
    onClose: modal => {
        myCropper && myCropper.destroy()
    },
    onShow: modal => editCon.style.display = "none"
});


/*
    Process
    1.) Check if image is existing
        True  - Load image with the x mark
        False - Let it be use the image handler

    2.) If image is changed
        update_img = 2

    3.) If x is pressed meaning reset
        update_img = 1
*/

// INITIAL LOAD IMAGE
if (img != ""){
    // if true meaning initial
    loadImg(img, true);
}


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
                    autoCropArea  : 1,
                    viewMode      : 3,
                    zoomable      : !0,
                    dragMode      : "move",
                    aspectRatio   : 1,
                    background    : !1,
                    ready: function() {
                        this.cropper.crop()
                    }
                })
            }
        }
}));

// LOAD IMAGE TO HTML
function loadImg(srcEncoded, is_init) {
    if (srcEncoded) {
        const html = `\n    <div data-show-btn class="Cur(p) Pos(r) Mend(12px)">\n    <span onclick="removeImage(this)" title="Remove Image" id="" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span>\n    <img id="picContainer" width="70" height="70" class=" Mend(10px)" src="` + srcEncoded + `" alt="" />\n    </div>\n    `;
        imgCon.insertAdjacentHTML("afterbegin", html);
        file.nextElementSibling.style.display = "none";

        // CHECK IF INITIAL LOAD IMAGE OR CHANGE IMAGE
        if(is_init == true ){
            update_img.value = "0";
        } else {
            update_img.value = "2";
        }
    }
}


// SUBMIT BUTTON FOR GCROPPER
document.querySelector("#submitBtn").addEventListener("click", e => {
    e.preventDefault();
    const croppedimage = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress);
    
    $('input[name="pic"]').remove();
    var image_input = document.createElement("input");
    image_input.type = "hidden";
    image_input.id = "pic_list";
    image_input.name = "pic_list";
    image_input.value = JSON.stringify({
        data: croppedimage
    });
    document.getElementById("form").appendChild(image_input);

    // REMOVE THE PLACEHOLDER IMAGE
    $('img[id="picContainer"]').remove();
    loadImg(croppedimage);
    MicroModal.close("modal-2");
    update_img.value = "2"
});

document.querySelector("#resetBtn").addEventListener("click", e => {
    myCropper.reset()
});

// WHEN X IS PRESSED
function removeImage(el) {
    el.parentElement.remove();
    file.nextElementSibling.style.display = "flex";
    update_img.value = "1";
    if(document.getElementById("pic_list")){
        document.getElementById("pic_list").remove()
    }
}

// LOAD ICON TO BE SHOWED - TABLER ICONS
function loadIcon(e) {
    
    if (e) {
        const svg = document.querySelector('[name="icons"]:checked+label svg')    
        const s = new XMLSerializer().serializeToString(svg)
        const dataURL = window.btoa(s);
        var croppedimage = `data:image/svg+xml;base64,${dataURL}`
        loadImg(croppedimage, false);

        var image_input = document.createElement("input");
            image_input.type = "hidden";
            image_input.id="pic_list";
            image_input.name = "pic_list";
            image_input.value = JSON.stringify({
                data: croppedimage, svgId: e, svgColor: $('[data-text]').val()
            });
        document.getElementById("form").appendChild(image_input)
        update_img.value = "2"
    }
  }


