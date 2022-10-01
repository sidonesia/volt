const cc = document.querySelector('input[name="code"]');
if (cc) {
    const captcha = new Captcha($("#canvas"), { caseSensitive: false, length: 4 });
    var cValidate = function (e) {
        const ans = captcha.valid($('input[name="code"]').val());
        if (!ans) {
            e.preventDefault();
            cc.value = "";
        }
    };
}
$("#f0").validate({
    submitHandler: function (form) {
        var params = $(form).serialize();
        params += "&" + $.param({ clr: "" }, true);
        $.ajax({
            type: "POST",
            url: "/api/auth/l0",
            async: false,
            data: params,
            success: function (response) {
                mAction = response.message_action;
                mData = response.message_data;
 
                if (mAction == "LOGIN_SUCCESS") {
                    if (is_cstmpay == 'TRUE') {
                        $('#form').submit();
                        return;
                    }
                    if (!mData.email_verified && mData.need_verification) {
                        alert("Please verify your account by clicking the link sent to your registered e-mail !");
                        return;
                    }
                    window.location.href = _0x89e5;
                } else {
                    alert(response.message_desc);
                    return;
                }
            },
        });
    },
});
