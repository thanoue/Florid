jQuery(document).ready(function () {

    // // hiển thị thông báo error khi login
    // jQuery("#loginform input.btn").click(function(){
    //     jQuery("#login").append("<div class='overlay-dark'></div>");
    //     jQuery("#loginerror").fadeIn(350);
    //     jQuery(".overlay-dark").click(function(){
    //         jQuery("#loginerror").hide(250);
    //         jQuery(this).remove();
    //     })
    // });

    // hiện thị Support menu
    jQuery("a.nav-icon").click(function () {
        jQuery("#home").append("<div class='overlay-dark'></div>");
        jQuery(".customer-support").css({
            "left": "0",
            "opacity": "1"
        });
        jQuery(".overlay-dark").click(function () {
            jQuery(".customer-support").css({
                "left": "-80vw",
                "opacity": "0"
            });
            jQuery(this).remove();
        })
    });

    // hiển thị bảng màu
    jQuery(".order-product-item .item-status").click(function () {
        jQuery("#order").append("<div class='overlay-dark'></div>");
        jQuery("#colorBoard").fadeIn(350);
        jQuery(".overlay-dark").click(function () {
            jQuery("#colorBoard").hide(250);
            jQuery(this).remove();
        })
    });

    // hiển thị Action menu
    jQuery("li.order-product-item .item-detail").click(function () {
        jQuery("#order").append("<div class='overlay-dark'></div>");
        jQuery("#actionMenu").slideDown(350);
        jQuery(".overlay-dark").click(function () {
            jQuery("#actionMenu").slideUp(250);
            jQuery(this).remove();
        })
    });
    // hiển thị Action menu
    jQuery(".prodBrowser a").click(function () {
        jQuery("#addOrder").append("<div class='overlay-dark'></div>");
        jQuery("#actionMenu").slideDown(350);
        jQuery(".overlay-dark").click(function () {
            jQuery("#actionMenu").slideUp(250);
            jQuery(this).remove();
        })
    });

    // custom number input
    jQuery('<div class="quantity-button quantity-down">-</div>').insertBefore('.prodQuantity input');
    jQuery('<div class="quantity-button quantity-up">+</div>').insertAfter('.prodQuantity input');
    jQuery('.prodQuantity').each(function () {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min');

        btnUp.click(function () {
            var oldValue = parseFloat(input.val());
            var newVal = oldValue + 1;
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

        btnDown.click(function () {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

    });
})