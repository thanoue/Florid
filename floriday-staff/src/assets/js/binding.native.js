

function showErrorDialog(title, content) {
    jQuery("#login").append("<div class='overlay-dark'></div>");
    jQuery("#loginerror").fadeIn(350);
    jQuery(".overlay-dark").click(function () {
        jQuery("#loginerror").hide(250);
        jQuery(this).remove();
    });
}
