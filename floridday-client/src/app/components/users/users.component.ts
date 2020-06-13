import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user.entity';
import { ROLES } from 'src/app/app.constants';
import { NgForm } from '@angular/forms';
import { UserAvtService } from 'src/app/services/userr.avt.service';
import { UserAvtImage } from 'src/app/models/entities/file.entity';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { Guid } from 'guid-typescript';
declare function hideAdd(): any;
declare function showUserEditPopup(): any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent extends BaseComponent {

  users: {
    User: User,
    Role: string,
    IsSelected: boolean,
  }[];

  isSelectAll: boolean;
  currrentEditUser: User = new User();
  selectedPassword = "";
  edittingImageUrl: any;
  edittingFile: File;

  protected PageCompnent: PageComponent = new PageComponent('Nhân Viên', MenuItems.User);


  constructor(private userService: UserService, private userAvtImageService: UserAvtService) {
    super();
  }

  protected Init() {
    this.users = [];
    this.loadUsers();
  }

  loadUsers() {

    this.users = [];
    this.userService.getAll()
      .then(users => {

        users.forEach(user => {

          this.users.push({
            User: user,
            Role: ROLES.filter(p => p.Role == user.Role)[0].DisplayName,
            IsSelected: false
          });

        });

      });

  }

  onChange(event) {

    const filesUpload: File = event.target.files[0];

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    this.edittingFile = filesUpload;

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {
      this.edittingImageUrl = reader.result.toString();
    }

  }

  checkAllChange(isSelected) {
    this.users.forEach(user => {
      user.IsSelected = isSelected;
    });
    this.isSelectAll = isSelected;
  }


  selectUserToEdit(user: User) {

    console.log(user);

    Object.assign(this.currrentEditUser, user);

    this.edittingImageUrl = this.currrentEditUser.AvtUrl;

    this.edittingFile = null;

    this.selectedPassword = this.currrentEditUser.Password;

    this.currrentEditUser.Password = '';

    showUserEditPopup();

  }

  editUser(form: NgForm) {

    if (!form.valid)
      return;

    if (this.currrentEditUser.Password == '') {

      if (!this.currrentEditUser.Id) {
        this.showError('Thiếu mật khẩu!!');
        return;
      } else {
        this.currrentEditUser.Password = this.selectedPassword;
      }

    }

    console.log(this.currrentEditUser);

    if (this.currrentEditUser.Id) {
      this.deleteOldImageAndEdit();
      return;
    }

    console.log('is add');

    if (this.edittingFile && this.edittingFile != null) {

      let newAvt = new UserAvtImage();
      newAvt.Name = Guid.create().toString();

      this.userAvtImageService.addFile(this.edittingFile, newAvt, (url) => {

        if (url == 'ERROR')
          return;

        console.log(url);
        this.currrentEditUser.AvtUrl = url;

        this.updateUser('createUser');

      });

    } else {

      this.currrentEditUser.AvtUrl = 'https://i2.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1';

      this.updateUser('createUser');

    }

  }

  deleteOldImageAndEdit() {

    this.userAvtImageService.deleteFileByUrl(this.currrentEditUser.AvtUrl, (isDeleted) => {

      if (!isDeleted) {
        return;
      }

      let newAvt = new UserAvtImage();
      newAvt.Name = Guid.create().toString();

      if (this.edittingFile && this.edittingFile != null) {

        this.userAvtImageService.addFile(this.edittingFile, newAvt, (url) => {

          if (url == 'ERROR')
            return;

          this.currrentEditUser.AvtUrl = url;

          this.updateUser('editUser');
        });

      } else {
        console.log('edit user without change avt');
        this.updateUser('editUser');
      }
    });
  }

  updateUser(functionName: string) {

    this.startLoading();

    FunctionsService.excuteFunction(functionName, this.currrentEditUser)
      .then(() => {

        this.currrentEditUser = new User();
        this.edittingImageUrl = '';
        this.edittingFile = null;
        this.stopLoading();
        this.loadUsers();
        hideAdd();

      })
      .catch(err => {
        this.edittingFile = null;
        this.edittingImageUrl = '';
        this.stopLoading();
        this.showError(err);
        return;

      });
  }

}
