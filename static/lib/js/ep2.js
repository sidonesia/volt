const star = document.querySelector("[data-star]");
const image = document.getElementById("image");
const fileCon = document.getElementById("pic");
const editCon = document.querySelector("[data-edit-con]");
const imgCon = document.querySelector("[data-img-con]");
const imgCon2 = document.querySelector("#image");
const selectLabel = document.querySelector("[data-label]");
const selectParent = document.querySelector("[data-parent]");
const selects = document.querySelectorAll("[data-select] > label");
const onInput = document.getElementById("on");
const txtArea = document.querySelector("[data-txt-area]");
const txtSub = document.querySelector("[data-txt-sub]");
const title = document.getElementById("title");
const g_compress = getConfig("G_IMAGE_CROP_COMPRESS", 1);
const g_cont_type = getConfig("G_IMAGE_CONTENT_TYPE", "image/png");
const g_crop_conf = getConfig("G_IMAGE_CROP_CONFIG", { minWidth: 256, minHeight: 256, maxWidth: 4096, maxHeight: 4096, fillColor: "#fff", imageSmoothingEnabled: true, imageSmoothingQuality: "high" });
const g_thum_size = getConfig("G_IMAGE_THUM_SIZE", { width: 150, height: 150 });
let counter = 0;
let myCropper;
onInput.addEventListener("change", (e) => {
    e.target.checked ? (star.style.fill = "#ffc107") : (star.style.fill = "gray");
});
for (var i = 0; i < imgs.length; i++) {
    var obj = imgs[i];
    counter = i + 1;
    loadImg(obj.img, obj.id, counter);
}
function toDataURL(e, a, o, i) {
    let t = new Image();
    t.crossOrigin = "Anonymous";
    t.onload = function () {
        let e = document.createElement("canvas");
        let t = e.getContext("2d");
        let n;
        e.height = 150;
        e.width = 150;
        t.drawImage(this, 0, 0, e.height, e.width);
        n = e.toDataURL(i);
        o(n, a);
    };
    t.src = e;
    if (t.complete || t.complete === undefined) {
        t.src = "data:image/gif;base64, R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        t.src = e;
    }
}
$("#btn_dp").click(function (e) {
    if (!confirm("Are you sure?")) {
        e.preventDefault();
    } else {
        $("#form").attr("action", "/process/my-products/delete");
        document.getElementById("form").submit();
    }
});
$("#title").on("focusin focusout", function (e) {
    slug_checker();
});
slug_checker();
document.getElementById("counter").value = counter;
MicroModal.init({
    onClose: (e) => {
        myCropper.destroy();
    },
    onShow: (e) => {
        editCon.style.display = "none";
    },
});
document.querySelector("#btn_lm")&&document.querySelector("#btn_lm").addEventListener("click", (e) => {
    MicroModal.show("modal-1");
});
fileCon.addEventListener("click", (e) => {
    myCropper.destroy();
});
fileCon.addEventListener("change", function () {
    const e = this.files[0];
    if (e && e.type.startsWith("image/")) {
        var t = e.size / 1024 / 1024;
        if (t > 5) {
            alert("File size exceeds 5 MB");
        } else if (document.getElementById("counter").value == 5) {
            alert("you have reached the maximum limit for uploading images");
        } else {
            const n = new FileReader();
            n.readAsDataURL(e);
            n.onload = (e) => {
                imgCon2.setAttribute("src", e.target.result);
                editCon.style.display = "block";
                myCropper = new Cropper(image, {
                    autoCropArea: 1,
                    viewMode: 3,
                    zoomable: true,
                    dragMode: "move",
                    aspectRatio: 1,
                    background: false,
                    ready: function () {
                        this.cropper.crop();
                    },
                });
            };
        }
    }
});
document.querySelector("#submitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const t = myCropper.getCroppedCanvas(g_crop_conf).toDataURL(g_cont_type, g_compress);
    counter = counter + 1;
    var n = document.createElement("input");
    n.type = "hidden";
    n.id = "unsaved_" + counter;
    n.name = "pic_list";
    n.value = JSON.stringify({ data: t, counter: counter });
    var a = document.createElement("input");
    a.type = "hidden";
    a.id = "unsaved_" + counter + "_";
    a.name = "thumbnails";
    a.value = JSON.stringify({ data: myCropper.getCroppedCanvas(g_thum_size).toDataURL(g_cont_type, g_compress), counter: counter });
    document.getElementById("form").appendChild(n);
    document.getElementById("form").appendChild(a);
    loadImg(t, "unsaved_" + counter, counter);
    MicroModal.close("modal-2");
});
document.querySelector("#resetBtn").addEventListener("click", (e) => {
    myCropper.reset();
});
imgCon.addEventListener("click", (e) => {
    var t = document.getElementById("counter").value;
    const n = e.target;
    if (n.classList.contains("ri")) {
        id = $(n).attr("id");
        id2 = "unsaved_" + $(n).attr("data-counter") + "_";
        t = t - 1;
        document.getElementById("counter").value = t;
        $(`input[id="${id}"]`).remove();
        $(`input[id="${id2}"]`).remove();
        n.parentElement.remove();
        if (id.split("_")[0] != "unsaved") {
            $.ajaxSetup({
                beforeSend: function (e, t) {
                    if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(t.type)) {
                        e.setRequestHeader("X-CSRFToken", document.getElementById("_csrf_token").value);
                    }
                    if (e && e.overrideMimeType) {
                        e.overrideMimeType("application/j-soncharset=UTF-8");
                    }
                },
            });
            $.ajax({
                type: "DELETE",
                url: `/api/my-products/images/${id}`,
                data: {},
                contentType: "application/json charset=utf-8",
                async: false,
                success: function (e) {
                    resp = JSON.parse(e);
                    data = resp.message_data;
                    if (data.ok) n.parentElement.remove();
                    else t = t + 1;
                    document.getElementById("counter").value = t;
                },
            });
        }
    }
});
txtSub.insertAdjacentHTML("afterbegin", description);
txtSub.addEventListener("keyup", (e) => {
    txtArea.innerHTML = e.target.innerHTML;
});
txtArea.innerHTML = txtSub.innerHTML;
$("#base_price, #sale_price, #minimum_price, #suggested_price").on("keypress keyup blur", function (e) {
    $(this).val(
        $(this)
            .val()
            .replace(/[^\d].+/, "")
    );
    if (e.which < 48 || e.which > 57) {
        e.preventDefault();
    }
});
setStrikeThrough();
$("#base_price").focusout((e) => {
    val = $(e.target).val();
    if (!val) {
        document.getElementById("base_price").value = 0;
        $("#base_price").removeClass("Td(lt)");
    }
    if (val >= 0 && $("#sale_price").val()) {
        $("#base_price").addClass("Td(lt)");
    } else {
        $("#base_price").removeClass("Td(lt)");
    }
});
$("#sale_price").focusout((e) => {
    setStrikeThrough();
});
$("#minimum_price, #suggested_price").focusout((e) => {
    val = $(e.target).val();
    if (!val) {
        e.target.value = 0;
    }
});
$("input[name=on2]").change(function () {
    if ($(this).is(":checked")) {
        document.getElementById("disp_act").innerHTML = "Display Active";
    } else {
        document.getElementById("disp_act").innerHTML = "Display Inactive";
    }
});
jQuery.validator.addMethod("special", function (e, t) {
    return parseInt(document.getElementById("slug_available").value) == 0;
});
$("#form").validate({
    ignore: "",
    onblur: true,
    onkeyup: false,
    onfocusout: function (e) {
        this.element(e);
    },
    rules: { title: { required: true, special: true }, base_price: { required: true }, content_url: { required: true } },
    messages: { title: { required: "Please enter Title", special: "Input title is already being used" }, base_price: { required: "Please enter Price" }, content_url: { required: "Please enter Url" } },
    submitHandler: function (e) {
        document.querySelector(".loading").classList.remove("D(n)");
        var t = $(e).serialize();
        $.ajax({
            type: "POST",
            url: "/process/my-products/update",
            data: t,
            success: function (e) {
                window.location.replace("/admin/my-lynks/home");
            },
        });
    },
    invalidHandler: function (e, t) {
        var n = t.numberOfInvalids();
        if (n) {
            $("html, body").animate({ scrollTop: $(t.errorList[0].element).offset().top - 500 }, 500);
        }
    },
});
selectLabel.addEventListener("click", (e) => {
    selectParent.classList.toggle("D(n)");
});
selects.forEach((n) => {
    n.addEventListener("click", (e) => {
        const t = n.innerText;
        document.querySelector("[data-text]").innerText = t;
        selectParent.classList.add("D(n)");
    });
});
setRadioSelected();
function setRadioSelected() {
    if (cta_selected) {
        $(`#${cta_selected.id}`).prop("checked", true);
        document.querySelector("[data-text]").innerText = cta_selected.text;
    }
}
function slug_checker() {
    document.getElementById("slug_available").value = getURL("/my-products/slug/check", { pkey: document.getElementById("pkey").value, title: title.value }).count;
}
function setStrikeThrough() {
    if ($("#sale_price").val() && $("#base_price").val()) {
        $("#base_price").addClass("Td(lt)");
    } else {
        $("#base_price").removeClass("Td(lt)");
    }
}
function loadImg(t, n, a) {
    if (t) {
        const o = `<div class="Pos(r) D(ib) Mx(2px)"><span title="Remove Image" id="${n}" data-counter="${a}" class="ri Pos(a) End(-3px) T(-6px) Fz(8px) D(ib) Py(3px) Px(6px) Bdrs(50%) Bgc(#ff7272) C(#ffffff) Cur(p) Scale(1.1):h">X</span><img class="W(73px) H(70px) Bdrs(4px) Ov(h)" src="${t}" alt=""></div>`;
        const i = document.querySelector("[data-img-con]");
        i.insertAdjacentHTML("afterbegin", o);
        let e = document.getElementById("counter").value;
        document.getElementById("counter").value = parseInt(e) + 1;
    }
}
$("#cp1btn").click(function () {
    if (!slug_id) {
        url = window.location.href;
    } else {
        url = window.location.origin + "/" + username + "/" + slug_id;
    }
    copyToClipboard(url);
    showAToast("Copied!");
});
