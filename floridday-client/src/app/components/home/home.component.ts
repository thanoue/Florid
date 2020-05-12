import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  constructor(private router: Router, protected activatedRoute: ActivatedRoute, private tagService: TagService) {
    super();
  }

  protected Init() {

    // const tags: Tag[] = [];
    // for (let i = 1; i < 101; i++) {
    //   const tag = new Tag();
    //   tag.Description = "Khong co mo ta " + i;
    //   tag.Index = i;
    //   tag.Id = `hoa-hong-${i}`;
    //   tag.Name = `hoa hong ${i}`;

    //   tags.push(tag);
    // }

    // this.tagService.setList(tags, (tag) => {
    //   console.log(tag);
    // }).then((res) => {
    // });
  }

  logout() {

    this.authService.loutOutFirebase(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });
  }

  goToPrintJob() {
  }

  async getUsers() {
    try {
      this.startLoading();
      const users = await FunctionsService.excuteFunction('getUsers');
      console.log(users);
      this.stopLoading();
    } catch (error) {
      this.showWarning(error);
    }
  }
}
