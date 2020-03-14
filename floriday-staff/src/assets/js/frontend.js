jQuery(document).ready(function () {
    // custom number input
    jQuery(".popup-content img.item-detail-thumb").click(function () {
        var imgSource = jQuery(this).attr("src");
        appendInBody();
        jQuery("body").append("<div class='popup-image'><img src='" + imgSource + "'></div>");
        jQuery(".popup-image").show(250);
        jQuery(".overlay-dark").click(function () {
            jQuery(".popup-image").remove();
            jQuery(this).remove();
        })
    });
})

function filterFocus() {

    let Filter = jQuery('.filterCate').parent();
    if (Filter.hasClass("search")) {
        Filter.removeClass("search");
    }
}

function searchFocus(e) {
    let Filter = jQuery(e).parent();
    if (!Filter.hasClass("search")) {
        Filter.addClass("search");
    }
    jQuery(e).find('.form-control').focus();
}

function createNumbericElement() {
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
}

// append 2 element
function appendInBody() {
    if (jQuery("body").find(".overlay-dark").length) {
        jQuery("body").append("<div class='overlay-dark layer2'></div>");
    }
    else {
        jQuery("body").append("<div class='overlay-dark'></div>");
    }
}

// slide canvas menu
function customerSupport() {

    jQuery("body").append("<div class='overlay-dark'></div>");
    jQuery(".customer-support").css({
        "left": "0",
        "opacity": "1"
    });

    jQuery(".customer-support #logoutBtn").one("click", function () {
        jQuery(".overlay-dark").remove();
    });

    jQuery(".overlay-dark").one("click", function () {
        jQuery(".customer-support #logoutBtn").off("click");
        jQuery(".customer-support").css({
            "left": "-80vw",
            "opacity": "0"
        });
        jQuery(this).remove();
    });
}

// Menu Đơn hàng
function openOrderMenu() {
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" >Chuyển cho florist</a></li>
            <li><a class="menu-item-dynamic" data-index="1" >Nhận thành phẩm</a></li>
            <li><a class="menu-item-dynamic" data-index="2" >Giao hàng</a></li>
            <li><a class="menu-item-dynamic" data-index="3" >Hoàn thành</a></li>
            <li><a class="menu-item-dynamic" data-index="4" >Chi tiết sản phẩm</a></li>
        </ul>
    </div>`;
    slideUp(html, function (index) {
        switch (index) {
            case '0': window.location = '#' + index; break;
            case '1': window.location = '#' + index; break;
            case '2': window.location = '#' + index; break;
            case '3': window.location = '#' + index; break;
            case '4': openProductDetail();
        }
    });
}

// Menu Danh sách hoa
function selectProductCategory(menuItems, callback) {
    actionMenuSelecting(menuItems, callback);
}

function actionMenuSelecting(menuItems, callback) {

    let templateRes = '';

    menuItems.forEach(element => {
        var item = `<li><a class="menu-item-dynamic" data-index="0" data-value="${element.Value}"  href="javascript:void(0)">${element.Name}</a></li>`;
        templateRes += item;
    });

    var html = `<div class="actionMenu">
    <ul>
     ${templateRes}
    </ul>
    </div>`;

    slideUp(html, function (index) {
        callback(parseInt(index));
        // window.location = './danh-sach.html?' + index;
    });
}

// Menu tiến độ
function openProgMenu() {
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Nhận đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html, function (index) {
        switch (index) {
            case '0': alert("Nhận đơn"); break;
            case '1': window.location = './chi-tiet.html'; break;
        }
    });
}
// Menu hoàn thành đơn
function openCompMenu() {
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Hoàn thành đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html, function (index) {
        switch (index) {
            case '0': alert("Hoàn thành đơn"); break;
            case '1': window.location = './chi-tiet.html'; break;
        }
    });
}

// Menu Danh sách Khách hàng
function openCustMenu() {

    appendInBody();
    jQuery("#recentInfo").slideDown(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#recentInfo").slideUp(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

function selectSavedDeliveryInfo(e) {

    let index = parseInt(jQuery(e).attr('data-index'));

    window.DeliveryInfoReference.zone.run(() => { window.DeliveryInfoReference.selectDeliveryInfo(index); });

    jQuery("#recentInfo").slideUp(250, function () {
        jQuery(".overlay-dark").remove();
    });
}

// SlideUp Action menu
function slideUp(html, callback) {
    appendInBody();
    jQuery("body").append(html);

    jQuery(".actionMenu").slideDown(350);
    //click vào menu
    jQuery('.actionMenu a.menu-item-dynamic').one('click', function () {

        var index = jQuery(this).attr('data-index');
        var val = jQuery(this).attr('data-value');

        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".actionMenu").remove();
            jQuery(".overlay-dark").remove();
            callback(val);
        });
    });

    jQuery(".overlay-dark:not(.layer2)").one('click', function () {
        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    })

    jQuery(".overlay-dark.layer2").click(function () {
        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".overlay-dark.layer2").remove();
            jQuery(this).remove();
        });
    });

}

// Thông báo lỗi Login
function messageDialog(title, message) {
    appendInBody();

    var html = `<div id="loginerror" class="popup-content">
    <img src="../../../assets/images/alert.png" alt="">
    <p>${title}</p>
    <span>${message}</span>
    </div>`

    jQuery("body").append(html);

    jQuery("#loginerror").fadeIn(350);

    jQuery(".overlay-dark").one("click", function () {
        jQuery("#loginerror").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });
}
// HIển thị quét QR
function openQR() {
    appendInBody();
    jQuery("#codeQR").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#codeQR").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}
// HIển thị Xác nhận thành công
function openLoginError() {
    var html = `<div id="loginerror" class="popup-content">
            <img src="./images/success.png" alt="">
            <p>XÁC NHẬN</p>
            <span>Thanh toán thành công</span>
        </div>`;
    popUp(html);
}

// Hiển thị bảng màu
function openColorBoard() {
    appendInBody();
    jQuery("#colorBoard").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#colorBoard").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}



// Thêm thông tin
function openAddInfo() {
    appendInBody();
    jQuery("#infoAdd").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").one('click', function () {
        jQuery("#infoAdd").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });

    jQuery('#infoAdd #cancel-button').on('click', function () {
        jQuery("#infoAdd").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

function closeAddCustomerDialog() {
    jQuery("#infoAdd").hide(250, function () {
        jQuery(".overlay-dark").remove();
    });
}

// Hiển thị xác nhận đơn
function openOrderConfirm() {
    appendInBody();
    jQuery("#orderConfirm").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#orderConfirm").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

// Hiển thị xác nhận đơn
function openDeliConfirm() {
    appendInBody();
    jQuery("#deliConfirm").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#deliConfirm").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

//Thay đổi thứ thự đơn hàng
function openOrdChange() {
    var html = `<div id="changeOrder" class="popup-content"><div class="form-group">
        <input type="text" name="" id="" class="mainForm" placeholder="Thứ tự ưu tiên...">
    </div></div>`;
    popUp(html);
}

//Hiển thị số lượt xem
function openViewed() {
    appendInBody();
    jQuery("#viewed").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery(".popup-content").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}


// Thêm thông tin
function openExcForm() {
    appendInBody();
    jQuery("#exchangeAdd").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#exchangeAdd").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

// Popup thông báo
function popUp(html) {
    appendInBody();
    jQuery("body").append(html);
    jQuery(".popup-content").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery(".popup-content").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });
}

// Bao gồm thuế VAT
function changeVAT() {
    if (jQuery(".vatStatus").hasClass("on")) {
        jQuery(".vatStatus a span").animate({
            left: "-=30px",
        }, 200, function () {
            jQuery(".vatStatus").removeClass("on");
        });
    }
    else {
        jQuery(".vatStatus a span").animate({
            left: "+=30px",
        }, 200, function () {
            jQuery(".vatStatus").addClass("on");
        });
    }
}

function selectItem(e, className) {

    jQuery(className).removeClass('selected');

    jQuery(e).addClass('selected');

    window.selectItemReference.zone.run(() => { window.selectItemReference.itemSelected(jQuery(e).attr('data-id')); });

}

function setSelectedCustomerItem(id) {
    jQuery('#customer-list').each(function () {
        jQuery(this).find('.customer-item').each(function () {
            let itemId = jQuery(this).attr('data-id');
            if (itemId === id) {
                jQuery(this).addClass('selected');
            }
        })
    })
}   