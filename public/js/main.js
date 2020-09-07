$(document).ready(function () {
    var current_fs, next_fs, previous_fs;

    $(".datepicker").datepicker();

    $(".next").click(function () {
        str1 = "next1";
        str2 = "next2";
        str3 = "next3";
        current_fs = $(this).parent().parent().parent();
        next_fs = $(this).parent().parent().parent().next();

        $(current_fs).removeClass("show");
        $(next_fs).addClass("show");

        $("#progressbar li").eq($(".card").index(next_fs)).addClass("active");
    });

    $(".prev").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        $(current_fs).removeClass("show");
        $(previous_fs).addClass("show");

        $("#progressbar li")
            .eq($(".card").index(next_fs))
            .removeClass("active");

        // current_fs.animate({}, {
        //     step: function () {

        //         current_fs.css({
        //             'display': 'none',
        //             'position': 'relative'
        //         });

        //         previous_fs.css({
        //             'display': 'block'
        //         });
        //     }
        // });
    });
});
$(document).ready(function () {
    $('input[type="radio"]').click(function () {
        if ($(this).attr("id") == "lockbox") {
            $("#lockboxInput").show();
        } else if ($(this).attr("id") == "others") {
            $("#lockboxInput").show();
        } else {
            $("#lockboxInput").hide();
        }
    });
});
