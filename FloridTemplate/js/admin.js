jQuery(document).ready(function(){
    jQuery(".mainMenu li.hasChildren").append(`<span class="showSubMenu"></span>`);
    jQuery(".showSubMenu").click(function(){
        jQuery(this).parent().toggleClass("show");
    });

    jQuery(".menuToggle").click(function(){
        jQuery(".adminWrapper").toggleClass("mini");
    })
})

showUserEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
        <td scope="row" colspan="6">
            <form class="userEdit">
                <div class="row">
                    <div class="col-md-2 col-xs-12">
                        <div class="userAvatar">
                            <img src="../images/product-img.jpg" alt="..." class="img-thumbnail rounded-circle">
                        </div>
                        <div class="form-group avatarChange">
                            <label for="">Thay đổi ảnh đại diện</label>
                            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
                        </div>
                    </div>
                    <div class="col-md-10 col-xs-12">
                        <h4 class="userName">Adriana C. Ocampo Uria | ID: 211</h4>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                            <label for="inputEmail4">Địa chỉ Email</label>
                            <input type="email" class="form-control" id="inputEmail4" value="thanhhnp@gmail.com" disabled>
                            </div>
                            <div class="form-group col-md-6">
                            <label for="inputPassword4">Mật khẩu</label>
                            <input type="password" class="form-control" id="inputPassword4" value="#)$*)$*%K#J%*#%)*(" disabled>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputName">Họ và Tên</label>
                                <input type="text" class="form-control" id="inputName" value="Adriana C. Ocampo Uria">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputPhone">Số điện thoại</label>
                                <input type="text" class="form-control" id="inputPhone" value="0898443222">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="selectDist">Quận/Huyện</label>
                                <select class="form-control" name="" id="selectDist">
                                    <option value="0">Quận/Huyện</option>
                                    <option value="1">Quận 1</option>
                                    <option value="2">Quận 2</option>
                                    <option value="3">Quận 10</option>
                                    <option value="4">Quận 11</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="selectWard">Phường/Xã</label>
                                <select class="form-control" name="" id="selectWard">
                                    <option value="0">Phường/Xã</option>
                                    <option value="1">Đa Kao</option>
                                    <option value="2">Bến Nghé</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="inputAddress">Địa chỉ</label>
                                <input type="text" class="form-control" id="inputAddress" value="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
                            </div>
                        </div>
                        <div class="form-row">
                            
                            <div class="form-group col-md-3">
                                <label for="inputState">Quyền</label>
                                    <select id="inputState" class="form-control">
                                    <option>Choose...</option>
                                    <option selected>Account</option>
                                    <option>Shipper</option>
                                    <option>Florist</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="form-action row">
                    <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="hideUserEdit(event)">Lưu</button></div>
                    <div class="col-md-1"><button type="" class="btn btn-outline-secondary w-100" onclick="hideUserEdit(event)">Hủy</button></div>
                </div> 
            </form>
        </td>
    `);
    
}
hideUserEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
    <td scope="row">
        <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
            1
        </label>
        </div>
    </td>
    <td>
        <a href="javascript:void(0)" class="tdName" onclick="showUserEdit(event)">Adriana C. Ocampo Uria</a>
    </td>
    <td>0898222999</td>
    <td>Adriana C. Ocampo Uria st. TP. Hồ Chí Minh</td>
    <td>
        <span class="badge badge-pill badge-success d-block p-2">Account</span>
    </td>
    <td>
        <button type="button" class="btn btn-outline-info"  onclick="showUserEdit(event)"><i class="fa fa-pencil"></i> Sửa</button>
        <button type="button" class="btn btn-outline-danger"><i class="fa fa-remove"></i> Xóa</button>
    </td>
    `);
    
}


hideUserAdd = () => {
    jQuery(".popupContent").slideUp(250, function(){
        jQuery(this).remove();
    });

}

showAddNew = (obj) => {
    var html;
    switch (obj) {
        case "user": html = `<div class="popupContent" id="userAdd">
        <h4 class="userName">Thêm mới Nhân Viên</h4>
        <hr class="adminSeperate">
        <form action="">
        <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputEmail4">Địa chỉ Email</label>
        <input type="email" class="form-control" id="inputEmail4" placeholder="thanhhnp@gmail.com">
        </div>
        <div class="form-group col-md-6">
        <label for="inputPassword4">Mật khẩu</label>
        <input type="password" class="form-control" id="inputPassword4" placeholder="***********" >
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="inputName">Họ và Tên</label>
            <input type="text" class="form-control" id="inputName" placeholder="Adriana C. Ocampo Uria">
        </div>
        <div class="form-group col-md-6">
            <label for="inputPhone">Số điện thoại</label>
            <input type="text" class="form-control" id="inputPhone" placeholder="0898443222">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-4">
            <label for="selectDist">Quận/Huyện</label>
            <select class="form-control" name="" id="selectDist">
                <option value="0">Quận/Huyện</option>
                <option value="1">Quận 1</option>
                <option value="2">Quận 2</option>
                <option value="3">Quận 10</option>
                <option value="4">Quận 11</option>
            </select>
        </div>
        <div class="form-group col-md-4">
            <label for="selectWard">Phường/Xã</label>
            <select class="form-control" name="" id="selectWard">
                <option value="0">Phường/Xã</option>
                <option value="1">Đa Kao</option>
                <option value="2">Bến Nghé</option>
            </select>
        </div>
        <div class="form-group col-md-4">
            <label for="inputAddress">Địa chỉ</label>
            <input type="text" class="form-control" id="inputAddress" placeholder="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
        </div>
    </div>
    <div class="form-row">
        
        <div class="form-group col-md-3">
            <label for="inputState">Quyền</label>
                <select id="inputState" class="form-control">
                <option selected>Choose...</option>
                <option >Account</option>
                <option>Shipper</option>
                <option>Florist</option>
                <option>Other</option>
            </select>
        </div>
    </div>
          <div class="form-group avatarChange">
            <label for="">Chọn ảnh đại diện</label>
            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
          </div>
          <div class="form-action row">
            <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button></div>
            <div class="col-md-1"><a href="javascript:void(0)" class="btn btn-outline-secondary w-100" onclick="hideUserAdd()">Hủy</a></div>
        </div> 
        </form>
      </div>
        `; break;
        case "customer":
            html = `<div class="popupContent" id="userAdd">
            <h4 class="userName">Thêm mới Khách Hàng</h4>
            <hr class="adminSeperate">
            <form action="">
            <div class="form-row">
            <div class="form-group col-md-6">
            <label for="inputEmail4">Địa chỉ Email</label>
            <input type="email" class="form-control" id="inputEmail4" placeholder="thanhhnp@gmail.com">
            </div>
            <div class="form-group col-md-6">
            <label for="inputPassword4">Mật khẩu</label>
            <input type="password" class="form-control" id="inputPassword4" placeholder="***********" >
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="inputName">Họ và Tên</label>
                <input type="text" class="form-control" id="inputName" placeholder="Adriana C. Ocampo Uria">
            </div>
            <div class="form-group col-md-6">
                <label for="inputPhone">Số điện thoại</label>
                <input type="text" class="form-control" id="inputPhone" placeholder="0898443222">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-4">
                <label for="selectDist">Quận/Huyện</label>
                <select class="form-control" name="" id="selectDist">
                    <option value="0">Quận/Huyện</option>
                    <option value="1">Quận 1</option>
                    <option value="2">Quận 2</option>
                    <option value="3">Quận 10</option>
                    <option value="4">Quận 11</option>
                </select>
            </div>
            <div class="form-group col-md-4">
                <label for="selectWard">Phường/Xã</label>
                <select class="form-control" name="" id="selectWard">
                    <option value="0">Phường/Xã</option>
                    <option value="1">Đa Kao</option>
                    <option value="2">Bến Nghé</option>
                </select>
            </div>
            <div class="form-group col-md-4">
                <label for="inputAddress">Địa chỉ</label>
                <input type="text" class="form-control" id="inputAddress" placeholder="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
            </div>
        </div>
                <div class="form-action row">
                <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button></div>
                <div class="col-md-1"><a href="javascript:void(0)" class="btn btn-outline-secondary w-100" onclick="hideUserAdd()">Hủy</a></div>
            </div> 
            </form>
            </div>
            `; break;
        default:
            break;
    }
    jQuery(".adminWrapper").append(html);
    jQuery(".popupContent").slideDown(350);
}