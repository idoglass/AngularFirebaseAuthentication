import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NgAuthService } from '../../../ng-auth.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
fullUser: User;
cUser: any;
  constructor(public ngAuthService: NgAuthService,
              public userService: UserService, ) { }

  ngOnInit(): void {
    this.cUser = JSON.parse(localStorage.getItem('user'));
    this.fullUser = JSON.parse(localStorage.getItem('user'));
    this.userService.getUserDoc(this.cUser.uid).subscribe(res => {
      this.fullUser = res as User;
    });
  }
  deleteUser() {
    if (window.confirm("Do you really want to leave?")) {
      this.ngAuthService.deleteUser();
    }
    
  }

}
