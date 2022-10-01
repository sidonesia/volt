$(document).ready(function() {
    $(".sortable").sortable({
    handle: '.handle',
    axis: 'y',
    start: function(e, ui) {
    $(this).attr('data-previndex', ui.item.index());
    },
    update: function (event, ui) {
        index = $(ui.item).index()
        var newIndex = ui.item.index();
        var oldIndex = $(this).attr('data-previndex');
        var element_id = ui.item.attr('id');
        $(this).removeAttr('data-previndex');

        var data = $(".sortable").sortable('toArray')
        $.ajaxSetup({
            beforeSend: function(x, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
                    x.setRequestHeader("X-CSRFToken", document.getElementsByName('_csrf_token')[0].value)
                }
                if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            }
        })
        $.ajax({
            data: JSON.stringify({ data : data }),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: '/process/my-lynks/sort'
        });
    }
    });
});