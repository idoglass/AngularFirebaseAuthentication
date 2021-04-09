import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgAuthService } from 'src/app/ng-auth.service';
import { AESEncryptDecryptService } from 'src/app/shared/aesencrypt-decrypt-service.service';
import { User } from '../../user.model';
import { UserService } from '../../user.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  user: User;
  url: string;
  decoded: any;
  userIsReciver: boolean;
  invitationIsValid: boolean;
error: string;
  constructor(
              private groupService: GroupService,
              public auth: NgAuthService,
              public userService: UserService,
              private act: ActivatedRoute,
              public router: Router,
              private aes: AESEncryptDecryptService ) { }

  ngOnInit(): void {
    this.url  = this.act.snapshot.paramMap.get('id');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userIsReciver = false;
    this.invitationIsValid = false;
    try {this.decoded = JSON.parse( this.aes.decrypt(this.url));

         const timestamp = new Date().getTime() - (15 * 24 * 60 * 60 * 1000);

         if (this.decoded.reciver ===  this.user.email) {
                              this.userIsReciver = true; } else {
                              this.error = 'you are not you are not allowed to join this group with this user '; }
         if (Date.parse(this.decoded.date) >  timestamp) {
                              this.userIsReciver = this.userIsReciver; } else {
                              this.userIsReciver = false;
                              this.error = 'this inivtation was expierd' ; }
        } catch { this.error = 'problem with invitation URL'; }
  }
join(id: string): void {
  this.groupService.updateGroupUser(this.user, id, 'user', 'true');
  const name = this.user.email.split('@');
  this.groupService.deletePendingUser(id, name[0]);
  this.router.navigate(['/dashboard/group-profile/' + id]);
}
reject(id: string): void {
  const name = this.user.email.split('@');
  this.groupService.createPendingUser(id, this.user.email, 'rejected');
  this.router.navigate(['/dashboard/']);
}
}
