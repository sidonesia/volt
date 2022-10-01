import { fn } from "./modules/utils.js";
export let sp = {
    init: () => {},
    fetchShipperDataV2: (e, t) => {
        let i;
        fn.api.post(e, t).done(function (e) {
            i = $.map(e.data.rows, function (e) {
                return { id: e.id, text: e.name, item: e };
            });
        });
        return i;
    },
    eClick: (e) => {
        const info = e.closest("div").querySelector(".mtc");
        info.classList.toggle("show");
    },
    address: {
        clearOption: () => {
            $("#district").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            document.getElementById("zipcode").value = "";
            $("#suburb").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            document.getElementById("zipcode").value = "";
        },
        nextstep: (e) => {
            e.preventDefault();
            var t = fn.serializedToJson("#form");
            t.prev_link = window.location.href.split('?')[0];
            if ($("#form").valid()) {
                fn.api.post("/v1/api/cart/step-2", t).done(function (e) {
                    if (e["message_data"]["status"]) {
                        window.location.replace("/checkout/" + e["message_data"]["slug"] + "/shipping-methods");
                    } else {
                        alert("Whoops, looks like something went wrong");
                    }
                });
            }
        },
        init: (e) => {
            const TOUT = 150;
            $("[data-select]").select2({ placeholder: "Please select", allowClear: true, width: "100%" });
            $("#province").prepend($("<option selected ></option>")).select2({ placeholder: "Please select", data: e.p, width: "100%" }),
                $("#province").on("select2:select", function (e) {
                    var t = e.params.data;
                    $("#city").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                    sp.address.clearOption();
                    setTimeout(function () {
                        $("#city")
                            .prepend($("<option selected ></option>"))
                            .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/cities-v2", { province_id: t.id }), width: "100%" });
                    }, TOUT);
                });
            $("#city").on("select2:select", function (e) {
                var t = e.params.data;
                $("#district").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                sp.address.clearOption();
                setTimeout(function () {
                    $("#district")
                        .prepend($("<option selected ></option>"))
                        .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/suburbs-v2", { city_id: t.id }), width: "100%" });
                }, TOUT);
            });
            $("#district").on("select2:select", function (e) {
                var t = e.params.data;
                $("#suburb").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                document.getElementById("zipcode").value = "";
                setTimeout(function () {
                    $("#suburb")
                        .prepend($("<option selected ></option>"))
                        .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/areas-v2", { suburb_id: t.id }), width: "100%" });
                }, TOUT);
            });
            $("#suburb").on("select2:select", function (e) {
                var t = e.params.data;
                setTimeout(function () {
                    fn.api.post("/v1/api/shipper/location-postal-v2", { postal: t.item.postcode, area_name: t.item.name }).done(function (e) {
                        document.getElementById("signature").value = typeof e.signature != "undefined" ? e.signature : "";
                        document.getElementById("zipcode").value = typeof e.postcode != "undefined" ? e.postcode : "";
                        document.getElementById("area_name").value = typeof e.area_name != "undefined" ? e.area_name : "";
                    });
                }, TOUT);
            });
            $("#form").validate({
                ignore: "",
                onblur: true,
                onkeyup: false,
                onfocusout: function (e) {
                    this.element(e);
                },
            });
            $("#name").rules("add", { required: true, messages: { required: "This Field is required." } });
            fn["int"]($('[name="phone"]'));
            $.validator.addMethod(
                "pn",
                function (e, t) {
                    if (!fn.isphone(e)) {
                        return false;
                    }
                    return true;
                },
                "Phone number is not valid."
            );
            $("#phone").rules("add", { required: true, pn: true });
            $.validator.addMethod(
                "ps",
                function (e, t) {
                    if (!$("#province :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#province").rules("add", { ps: true });
            $.validator.addMethod(
                "cs",
                function (e, t) {
                    if (!$("#city :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#city").rules("add", { cs: true });
            $.validator.addMethod(
                "ds",
                function (e, t) {
                    if (!$("#district :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#district").rules("add", { ds: true });
            $.validator.addMethod(
                "ss",
                function (e, t) {
                    if (!$("#suburb :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#suburb").rules("add", { ss: true });
        },
    },
    methods: {
        nextstep: (e) => {
            e.preventDefault();
            var t = $("input[name=shipping_method]:checked");
            var i = fn.serializedToJson("#form");
            i.prev_link = window.location.href.split('?')[0];
            i.signature = t.val();
            i.rate_id = t.attr("id");
            if (t.length) {
                fn.api.post("/v1/api/cart/checkout", i).done(function (e) {
                    let pricing = e.message_data.pricing;
                    if (pricing.status == "fail") {
                        alert(pricing.data.content);
                    } else {
                        window.location.replace(e["message_data"]["checkout_link"]);
                    }
                });
            }
        },
        init: (e) => {},
    },
    orders: {
        changeToProcess: (t, e) => {
            var f = fn.serializedToJson("#awForm");
            f.uuid = t.id;
            f.status = 1;
            fn.api.post("/v1/api/transactions/change-status", f).done((e) => {
                window.location.reload();
            });
        },
        changeToComplete: (t, e) => {
            var f = fn.serializedToJson("#awForm");
            f.uuid = t.id;
            f.status = 4;
            fn.api.post("/v1/api/transactions/change-status", f).done((e) => {
                window.location.reload();
            });
        },
        openModal: (t, e) => {
            document.getElementById("airway_bill").value = "";
            MicroModal.show("modalAlert");
            $("#modalAlert").data("argument", { id: t.id });
        },
        data: (e) => {
            return e;
        },
    },
    api: {
        updateAwBill: (t, e) => {
            e.preventDefault();
            var args = $("#modalAlert").data("argument");
            var t = fn.serializedToJson("#awForm");
            t.uuid = args.id;
            if ($("#awForm").valid()) {
                fn.api.post("/v1/api/transactions/update", t).done((e) => {
                    MicroModal.close("modalAlert");
                    window.location.reload();
                });
            }
        },
    },
};
window.sp = sp;
