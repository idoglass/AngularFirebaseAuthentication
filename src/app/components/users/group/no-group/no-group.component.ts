import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../user.model';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-no-group',
  templateUrl: './no-group.component.html',
  styleUrls: ['./no-group.component.css']
})
export class NoGroupComponent implements OnInit {
  groups: Group[];
  user: User;

  constructor(public router: Router, private groupService: GroupService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
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
    this.groupService.setGroupCookie(group);
    this.router.navigate(['dashboard/list-group'])
  }




}
