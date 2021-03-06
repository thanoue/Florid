jQuery(document).ready(function(){
    // custom number input
    jQuery('<div class="quantity-button quantity-down">-</div>').insertBefore('.prodQuantity input');
    jQuery('<div class="quantity-button quantity-up">+</div>').insertAfter('.prodQuantity input');
    jQuery('.prodQuantity').each(function() {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min');
  
        btnUp.click(function() {
            var oldValue = parseFloat(input.val());
            var newVal = oldValue + 1;
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
            });
  
        btnDown.click(function() {
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
    jQuery("#deliConfirm img.item-detail-thumb").click(function(){
        var imgSource = jQuery(this).attr("src");
        appendInBody();
        jQuery("body").append("<div class='popup-image'><img src='"+ imgSource +"'></div>");
        jQuery(".popup-image").show(250);
        jQuery(".overlay-dark").click(function(){
            jQuery(".popup-image").remove();
            jQuery(this).remove();
        })
    });
    jQuery(".prodFilter .filterSearch").click(function(){
        let Filter = jQuery(this).parent();
        if(!Filter.hasClass("search"))
        {
            Filter.addClass("search");
            Filter.find("a").attr("onclick", null);
        }
    });
    jQuery(".prodFilter .filterCate").click(function(){
        let Filter = jQuery(this).parent();
        if(Filter.hasClass("search"))
        {
            Filter.removeClass("search");
            Filter.find("a").attr("onclick","openListMenu()");
        }
    })
})
// append 2 element
function appendInBody()
{
    if(jQuery("body").find(".overlay-dark").length)
    {
        jQuery("body").append("<div class='overlay-dark layer2'></div>");
    }
    else
    {
        jQuery("body").append("<div class='overlay-dark'></div>");
    }
}

// slide canvas menu
function customerSupport(){
    jQuery("body").append("<div class='overlay-dark'></div>");
        jQuery(".customer-support").css({
            "left":"0",
            "opacity":"1"
        });
        jQuery(".overlay-dark").click(function(){
            jQuery(".customer-support").css({
                "left":"-80vw",
                "opacity":"0"
            });
            jQuery(this).remove();
        });
}

// Menu Đơn hàng
function openOrderMenu(){
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" >Chuyển cho florist</a></li>
            <li><a class="menu-item-dynamic" data-index="1" >Nhận thành phẩm</a></li>
            <li><a class="menu-item-dynamic" data-index="2" >Giao hàng</a></li>
            <li><a class="menu-item-dynamic" data-index="3" >Hoàn thành</a></li>
            <li><a class="menu-item-dynamic" data-index="4" >Chi tiết sản phẩm</a></li>
        </ul>
    </div>`;
    slideUp(html,function(index){
        switch(index)
        {
            case '0' : window.location = '#'+index; break;
            case '1' : window.location = '#'+index; break;
            case '2' : window.location = '#'+index; break;
            case '3' : window.location = '#'+index; break;
            case '4' : window.location = './chi-tiet.html?'+index; break;
        }
    });
}

// Menu Danh sách hoa
function openListMenu()
{
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Bó hoa tươi</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Bình hoa tươi</a></li>
            <li><a class="menu-item-dynamic" data-index="2"  href="javascript:void(0)">Hộp hoa tươi</a></li>
            <li><a class="menu-item-dynamic" data-index="3"  href="javascript:void(0)">Giỏ hoa tươi</a></li>
            <li><a class="menu-item-dynamic" data-index="4"  href="javascript:void(0)">Hoa cưới</a></li>
            <li><a class="menu-item-dynamic" data-index="5"  href="javascript:void(0)">Hoa nghệ thuật</a></li>
        </ul>
        </div>`;
    slideUp(html,function(index){
        window.location = './danh-sach.html?'+index;
    });
}

// Menu tiến độ
function openProgMenu()
{
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Nhận đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html,function(index){
        switch(index)
        {
            case '0' : alert("Nhận đơn"); break;
            case '1' : window.location = './chi-tiet.html'; break;
        }
    });
}
// Menu hoàn thành đơn
function openCompMenu()
{
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Hoàn thành đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html,function(index){
        switch(index)
        {
            case '0' : openConfirm(); break;
            case '1' : window.location = './chi-tiet.html'; break;
        }
    });
}

// Menu tiến độ
function openProgMenu2()
{
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Nhận giao đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html,function(index){
        switch(index)
        {
            case '0' : alert("Nhận giao"); break;
            case '1' : window.location = './chi-tiet.html'; break;
        }
    });
}
// Menu hoàn thành đơn
function openCompMenu2()
{
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Hoàn thành giao</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html,function(index){
        switch(index)
        {
            case '0' : alert("Hoàn thành giao"); break;
            case '1' : window.location = './chi-tiet.html'; break;
        }
    });
}

// Menu Danh sách Khách hàng
function openCustMenu()
{
    appendInBody();
    jQuery("#recentInfo").slideDown(350);

    //click vào menu
    jQuery(document).on('click','#recentInfo ul li',function(){
        var recN = jQuery(this).find(".recentInfo-name").html();
        var recP = jQuery(this).find(".recentInfo-phone").html();
        var recD = jQuery(this).find(".recentInfo-date").html();
        var recA = jQuery(this).find(".recentInfo-add").html();
        var infoArray = new Array(recN,recP,recA,recD);
        var i = 0;
        jQuery("#recentInfo").slideUp(250,function(){
            jQuery(".overlay-dark").remove();
            jQuery(".addInfoForm .form-group").each(function(index,value)
            {
                jQuery(value).find("input").val(infoArray[i]); i++;
            });
        });
    });
    
    jQuery(".overlay-dark:not(.layer2)").click(function(){
        jQuery("#recentInfo").slideUp(250,function(){
            jQuery(".overlay-dark").remove();
        });
    });
}

// Menu hoàn thành đơn
function openTagMenu()
{
    var html = `<div class="actionMenu checkMenu">
            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                <span class="main-bg vatCustom"></span>Hoa Hồng
              </label>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                  <span class="main-bg vatCustom"></span>Hoa Huệ
                </label>
              </div>
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                  <span class="main-bg vatCustom"></span>Hoa Lan
                </label>
              </div>
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                  <span class="main-bg vatCustom"></span>Hoa Cẩm Chướng
                </label>
              </div>
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                  <span class="main-bg vatCustom"></span>Hoa Lyly
                </label>
              </div>
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                  <span class="main-bg vatCustom"></span>Hoa Cúc
                </label>
              </div>
        </div>`;
    slideUp(html,function(index){
        
    });
}

// SlideUp Action menu
function slideUp(html,callback)
{
    appendInBody();
    jQuery("body").append(html);

    jQuery(".actionMenu").slideDown(350);
    //click vào menu
    jQuery(document).on('click','a.menu-item-dynamic',function(){
        var index = jQuery(this).attr('data-index');

        jQuery(".actionMenu").slideUp(250,function(){
            jQuery(".actionMenu").remove();
            jQuery(".overlay-dark").remove();
            callback(index);
        });
    });

    jQuery(".overlay-dark:not(.layer2)").click(function(){
        jQuery(".actionMenu").slideUp(250,function(){
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });
    jQuery(".overlay-dark.layer2").click(function(){
        jQuery(".actionMenu").slideUp(250,function(){
            jQuery(".overlay-dark.layer2").remove();
            jQuery(this).remove();
        });
    });
    
}

// Thông báo lỗi Login
openLoginError = () =>
{
    popUpContent("#loginerror");
}
// Thông báo thành công
openSuccess = () =>
{
    popUpContent("#successInfo");   
}
// HIển thị quét QR
openQR = () =>
{   
    popUpContent("#codeQR");
}

// HIển thị dialog xác nhận
openConfirm = () =>
{  
    popUpContent("#confirmDialog");  
}

// Hiển thị bảng màu
openColorBoard = () =>
{
    popUpContent("#colorBoard"); 
}

// Hiển thị danh sách ngân hàng
openEBank = () =>
{
    popUpContent("#bankList"); 
}


// Thêm thông tin
openAddInfo = () =>
{
    popUpContent("#infoAdd"); 
}

// Hiển thị xác nhận đơn
openOrderConfirm = () =>
{
    popUpContent("#orderConfirm");

}

// Hiển thị xác nhận đơn
openDeliConfirm = () =>
{
    popUpContent("#deliConfirm");
}

//Thay đổi thứ thự đơn hàng
openOrdChange = () =>
{
    var html = `<div id="changeOrder" class="popup-content dialog-popup"><div class="form-group">
        <input type="text" name="" id="" class="mainForm" placeholder="Thứ tự ưu tiên..."></div>
        <div class="row"><div class="col-6"><button class=" main-btn btn">Xác nhận</button></div>
        <div class="col-6"><button class=" main-bg border btn">Hủy</button></div></div></div>`;
    popUp(html);
}

//Hiển thị số lượt xem
openViewed = () =>
{
    popUpContent("#viewed");
}

// Thêm thông tin
openExcForm =() => {
    popUpContent("#exchangeAdd");
}
// Hiển thị popup thêm địa chỉ
openAddressAdd = () =>
{
    popUpContent("#addressAdd");
}

// Popup thông báo
function popUp(html){
    appendInBody();
    jQuery("body").append(html);
    jQuery(".popup-content").fadeIn(350); 

    jQuery(".overlay-dark:not(.layer2)").click(function(){
        jQuery(".popup-content").hide(250,function(){
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });
}

popUpContent = (id) => {
    appendInBody();
    jQuery(id).fadeIn(350); 

    jQuery(".overlay-dark:not(.layer2)").click(function(){
        jQuery(id).hide(250,function(){
            jQuery(".overlay-dark").remove();
        });
    });
}