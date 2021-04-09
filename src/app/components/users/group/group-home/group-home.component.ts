import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AESEncryptDecryptService } from 'src/app/shared/aesencrypt-decrypt-service.service';
import { card } from 'src/app/shared/card/card.component';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { MessageService } from '../../messages/message.service';
import { User } from '../../user.model';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-home',
  templateUrl: './group-home.component.html',
  styleUrls: ['./group-home.component.css']
})
export class GroupHomeComponent implements OnInit {

  group: Group;
  user: User;
  header: Header;
  constructor(
              private groupService: GroupService,
              private messageService: MessageService,
              private act: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,
              private aes: AESEncryptDecryptService ){}


  ngOnInit(): void {
    let id = '';
    this.act.paramMap.subscribe(params => {
          id = params.get('id');
          console.log(id)
          const group = JSON.parse(localStorage.getItem('group')) as Group;
          this.router.navigate(['/dashboard/group-home/' + group.id]);
          if (id) {
          this.header = {title: 'Group ' + group.name, button: 'Profile', url: '/dashboard/group-profile/' + id};
          this.groupService.changeNav(group)
          } else {
          id = group.id;
          
          }
          
      });

    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getGroup(id: string): void{
    this.groupService.getGroupDoc(id).subscribe(res => {
      this.group = res as Group;
      this.group.id = id;
      
    });
  }
}
