import { Component, OnInit } from '@angular/core';
import { AESEncryptDecryptService } from 'src/app/shared/aesencrypt-decrypt-service.service';
import { stringify } from '@angular/compiler/src/util';
import { ActivatedRoute, Router } from '@angular/router';
import { card } from 'src/app/shared/card/card.component';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { Message } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { User } from '../../user.model';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

import {MatDialog} from '@angular/material/dialog';



@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.css']
})
export class GroupProfileComponent implements OnInit {
  group: Group;
  users: any[] = [];
  cUser: User;
  isManager: boolean;
newCard: card;
  cards: card[];
  header: Header;
  pending: any[] = [];
  constructor(
              private groupService: GroupService,
              private messageService: MessageService,
              private act: ActivatedRoute,
              public dialog: MatDialog,
              private aes: AESEncryptDecryptService ){}


  ngOnInit(): void {


let id = '';

this.act.paramMap.subscribe(params => {
      id = params.get('id');
      console.log(id);
   });

this.cUser = JSON.parse(localStorage.getItem('user'));
this.groupService.getGroupDoc(id).subscribe(res => {
      this.group = res as Group;

      this.group.id = id;
      this.header = {title: 'Group ' + this.group.name, button: 'edit', url: '/dashboard/update-group/' + this.group.id};
      this.isManager = false;
      this.users = [];
      for (const key in this.group) {
        if (this.group.hasOwnProperty(key) && this.group[key].status === 'true') {
          this.group[key].uid = key;
          if (  this.group[key].uid === this.cUser.uid &&
                this.group[key].role === 'manager' &&
                this.group[key].status === 'true'){
                  this.isManager = true;
                }
          this.users.push(this.group[key]);
        }
      }
      this.groupService.getPendingUserList(this.group.id).subscribe(res => {
        this.pending = res.map( e => {
          const element =  {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as any
          };
          let content;
          content = element.status === 'pending' ? 'waiting for user to accept' : '';
          content = element.status === 'rejected' ? 'user rejected invitiation' : content = content;
          return {
            title: element.name,
            subTitle: element.email,
            icon: 'pending',
            content,
            menuButton: [
              {type: 'deletePending', name: 'remove', icon: 'delete', id: element.name},
              {type: 'reShare', name: 'send invitation', icon: 'share', id: element.email}],
           };
        });

      });

      console.log('pending,', this.pending);

      this.cards = [];
      this.users.forEach(user => {
        console.log(user);
        const card =  {
        title: user.name,
        subTitle: user.role,
        icon: 'person',
        content: user.email,
        menuButton: []
       } as card;

        this.isManager ? card.menuButton.push({type: 'delete', name: 'delete', icon: 'delete', id: user.uid}) : card.menuButton = null;
        this.isManager && user.role === 'user' ?
        card.menuButton.push({type: 'manager', name: 'make manager', icon: 'manage_accounts', id: user.uid}) :
        card.menuButton = card.menuButton;
        this.isManager && user.role === 'manager' ?
        card.menuButton.push({type: 'user', name: 'make user', icon: 'person', id: user.uid}) :
        card.menuButton = card.menuButton;
        this.cards.push(card);

      });
    });
this.newCard = {title: 'new', icon: 'add', subTitle: 'add group member', content: ''};
  }

  updateGroupUser = (gid, user: User, role, status) => this.groupService.updateGroupUser(user, gid, role, status);
  sendInvitation = email => {
    const url = this.createJoinUrl(email.value)
    const now = new Date();

    const massege = {
      sender: this.cUser.email,
      reciver: [email.value],
      date: now,
      title: this.cUser.displayName + ' invites you to join ' + this.group.name,
      button: 'join',
      url: '/join/group/' + url

    }  as Message;
    this.messageService.createMessage(massege);
    this.groupService.createPendingUser(this.group.id , email.value, 'pending');
  }

  clickEvent(button){
    let user: User;
    this.users.forEach(element => {
      console.log(element, 'user');
      console.log(button, 'user');
      if (element.uid === button.id){user = element; }
    });

    switch (button.type) {
      case 'manager':
        this.updateGroupUser(this.group.id, user, 'manager', 'true');
        break;
      case 'user':
        this.updateGroupUser(this.group.id, user, 'user', 'true');
        break;
      case 'delete':
        this.updateGroupUser(this.group.id, user, 'user', 'false');
        break;
      case 'deletePending':
        this.groupService.deletePendingUser(this.group.id, button.id);
        break;
      case 'reShare':
        const data = {value: button.id};
        this.share(data);
        break;
      default:
        break;
    }
  }

  share(email){
    if (email.value){
    const sharePromise = navigator.share({
    url: '/join/group/' + this.createJoinUrl(email.value),
    title: 'join ' + this.group.name,
    text: this.cUser.email + 'invites you to join group',
  });
    this.groupService.createPendingUser(this.group.id , email.value, 'pending');
}
}

  createJoinUrl(email: string): string{
    const urlObject = {
      date: new Date(),
      id: this.group.id,
      name: this.group.name,
      sender: this.cUser.email,
      reciver: email
    }

    const objstr = JSON.stringify(urlObject);
    return this.aes.encrypt(objstr);
  }
}


