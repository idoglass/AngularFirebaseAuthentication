import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgAuthService } from 'src/app/ng-auth.service';
import { Group } from '../users/group/group.model';
import { GroupService } from '../users/group/group.service';
import { Message } from '../users/messages/message.model';
import { MessageService } from '../users/messages/message.service';
import { User } from '../users/user.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  Messages: Message[];
  groups: Group[];
  selectedGroup: Group;
  user: User;
  newMessages: number;
  showFiller = false;
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  showText = true;
  navColor: any;

  constructor(private messageService: MessageService,
              public ngAuthService: NgAuthService,
              private groupService: GroupService,
              public router: Router, ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.groupService.group$.subscribe(group => {
      this.selectedGroup = group;
      this.selectedGroup.color ? this.navColor = {background: 'linear-gradient(90deg, ' + this.selectedGroup.color.secondary + ' 0%, #f5f5f5 40% )'  } :
      this.navColor = {background: 'linear-gradient(90deg, #efefef 0%, #f5f5f5 40% )'  };
    });

    this.messageService.getInbox(this.user.email).subscribe(res => {
      this.Messages = res.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Message
        } as Message;
      });
      this.Messages = [...new Map(this.Messages.map((item: Message) =>   [item.id, item])).values()];
      this.Messages = this.Messages.filter((item: Message) => item.new === true);
      this.newMessages = this.Messages.length;
    });

    this.groupService.getGroupList(this.user.uid).subscribe(res => {
      this.groups = res.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Group
        } as Group;
      });


    });
  }

  onClick(group: Group){
    this.selectedGroup = group;
    this.navColor = {background: 'linear-gradient(90deg, ' + this.selectedGroup.color.secondary + ' 0%, #f5f5f5 40% )'  };
    this.groupService.setGroupCookie(group);
  }

  fabAction(){console.log('fab click')}

}
