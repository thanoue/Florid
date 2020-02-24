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
    
})
// append 2 element
function appendInBody(e)
{
    if(jQuery("body").find(".overlay-dark").length)
    {
        jQuery("body").append("<div class='overlay-dark layer2'></div>",e);
    }
    else
    {
        jQuery("body").append("<div class='overlay-dark'></div>",e);
    }
}

// slide canvas menu
function customerSupport(e){
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
            case '4' : openProductDetail();
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

// Menu Danh sách Khách hàng
function openCustMenu()
{
    var html = `<div class="actionMenu" id="custInfo">
                    <ul>
                        <li data-index="0">
                            <p class="custInfo-name">Lê Văn Đậu</p>
                            <span class="custInfo-phone">0898338294</span>
                            <span class="custInfo-date">00/03/2019</span>
                            <span class="custInfo-add">234 Phan Văn Trị, P.17, Q.Bình Thạnh, TP. Hồ Chí Minh</span>
                        </li>
                        <li data-index="1">
                            <p class="custInfo-name">Lê Văn Đậu</p>
                            <span class="custInfo-phone">0898338294</span>
                            <span class="custInfo-date">00/03/2019</span>
                            <span class="custInfo-add">234 Phan Văn Trị, P.17, Q.Bình Thạnh</span>
                        </li>
                        <li data-index="2">
                            <p class="custInfo-name">Lê Văn Đậu</p>
                            <span class="custInfo-phone">0898338294</span>
                            <span class="custInfo-date">00/03/2019</span>
                            <span class="custInfo-add">234 Phan Văn Trị, P.17, Q.Bình Thạnh</span>
                        </li>
                    </ul>
                </div>`;
    slideUp(html,function(index){
        window.location = './xac-nhan.html?'+index;
    });
}

// SlideUp Action menu
function slideUp(html,callback)
{
    appendInBody(html);
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
    //click vào tên kh
    jQuery(document).on('click','#custInfo li',function(){
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
function openLoginError()
{
    var html = `<div id="loginerror" class="popup-content">
            <img src="./images/alert.png" alt="">
            <p>ĐĂNG NHẬP LỖI</p>
            <span>Nhập sai mật khẩu hoặc số điện thoại<br/>Vui lòng nhập lại</span>
        </div>`;
    popUp(html);    
}
// HIển thị quét QR
function openQR()
{
    var html = `<div id="codeQR" class="popup-content">
            <span>Quét mã QR</span>
            <img src="./images/qr.jpg" alt="">
        </div>`;
    popUp(html);    
}
// HIển thị Xác nhận thành công
function openLoginError()
{
    var html = `<div id="loginerror" class="popup-content">
            <img src="./images/success.png" alt="">
            <p>XÁC NHẬN</p>
            <span>Thanh toán thành công</span>
        </div>`;
    popUp(html);    
}

// Hiển thị bảng màu
function openColorBoard()
{
    var html = `<div id="colorBoard" class="popup-content">
                <ul class="colorList">
                    <li class="colorItem">
                        <div class="item-status r"><span></span></div>
                        <label>Đang chờ</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status o"><span></span></div>
                        <label>Đang thực hiện</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status y"><span></span></div>
                        <label>Đang xác nhận</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status p"><span></span></div>
                        <label>Chờ giao</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status b"><span></span></div>
                        <label>Đang giao</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status g"><span></span></div>
                        <label>Hoàn thành</label>
                    </li>
                    <li class="colorItem">
                        <div class="item-status x"><span></span></div>
                        <label>Đã hủy</label>
                    </li>
                </ul>
            </div>`;
    popUp(html);
}

// Thông tin sản phẩm
function openProductDetail(){
    var html = `<div class="popup-content">THÔNG TIN SẢN PHẨM</div>`;
    popUp(html);
}

// Thông tin người nhận
function openCustInfo(){
    var html = `<div id="infoRec" class="popup-content">
                    <div class="currentInfo">
                        <span>Thông tin người nhận đã lưu</span>
                        <a href="javascript:void(0)" class="main-bg" onclick="openCustMenu();"><img src="./images/view.svg" class="white-filter"></a>
                    </div>
                    <div class="newInfo">
                        <form action="" class="addInfoForm">
                            <div class="form-group">
                                <input type="text" name="" id="" class="mainForm" placeholder="Tên người nhận...">
                            </div>
                            <div class="form-group">
                                <input type="tel" name="" id="" class="mainForm" placeholder="Số điện thoại...">
                            </div>
                            <div class="form-group">
                                <input type="text" name="" id="" class="mainForm" placeholder="Địa chỉ người nhận...">
                            </div>
                            <div class="form-group">
                                <input type="date" name="" id="" class="mainForm" placeholder="Thời gian...">
                            </div>
                            <div class="row">
                                <div class="col-8 mx-auto text-center">
                                    <button type="submit" class="btn main-btn w-100 mt-3">Xong</button>
                                </div>
                            </div>
                        </form>   
                    </div>
</div>`;
    popUp(html);
}
// Thêm thông tin
function openAddInfo(){
    var html = `<div id="infoAdd" class="popup-content">
                        <form action="" class="addInfoForm">
                            <div class="form-group">
                                <input type="text" name="" id="" class="mainForm" placeholder="Tên khách hàng...">
                            </div>
                            <div class="form-group">
                                <input type="tel" name="" id="" class="mainForm" placeholder="Số điện thoại...">
                            </div>
                            <div class="form-group">
                                <input type="text" name="" id="" class="mainForm" placeholder="Địa chỉ khách hàng...">
                            </div>
                            <div class="row">
                                <div class="col-6 mx-auto text-center">
                                    <button type="submit" class="btn grey-btn w-100 mt-3">Hủy</button>
                                </div>
                                <div class="col-6 mx-auto text-center">
                                    <button type="submit" class="btn main-btn w-100 mt-3">Lưu</button>
                                </div>
                            </div>
                        </form>   
</div>`;
    popUp(html);
}




// Popup thông báo
function popUp(html){
    appendInBody(html);
    jQuery(".popup-content").fadeIn(350); 

    // jQuery(document).on('click','.currentInfo a',function(){
    //     openCustMenu();
    // });


    jQuery(".overlay-dark:not(.layer2)").click(function(){
        jQuery(".popup-content").hide(250,function(){
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });
}

// Bao gồm thuế VAT
function changeVAT()
{
    if(jQuery(".vatStatus").hasClass("on"))
    {
        jQuery(".vatStatus a span").animate({
            left:"-=30px",
          }, 200, function() {
            jQuery(".vatStatus").removeClass("on");
          });
    }
    else
    {
        jQuery(".vatStatus a span").animate({
            left:"+=30px",
          }, 200, function() {
            jQuery(".vatStatus").addClass("on");
          });
    }
}