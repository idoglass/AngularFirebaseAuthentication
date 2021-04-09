import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { card } from 'src/app/shared/card/card.component';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { User } from '../../user.model';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css']
})
export class ListGroupComponent implements OnInit {
  groups: Group[];
  user: User;
  cards: card[];
  header: Header = {title: 'Groups', button: 'new group', url: '/dashboard/create-group'};

  constructor(private groupService: GroupService,
              public router: Router, ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.groupService.getGroupList(this.user.uid).subscribe(res => {
      this.groups = res.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Group
        } as Group;
      });
      this.cards = [];
      this.groups.forEach(group => {
        const card =  {
        title: group.name,
        subTitle: 'group',
        icon: 'group',
        content: group.discription,
        button: [
          {name: 'details', url: '/dashboard/group-profile/' + group.id , color: 'basic'},
          {type: 'home', name: 'Home', id: group.id, url: '/dashboard/group-home/' + group.id , color: 'primary'},
        ],
        menuButton: [
          {type: 'defualt', name: 'defualt', icon: 'push_pin', id: group.id},
          {type: 'details', name: 'details', icon: 'info', id: group.id},
          {type: 'edit', name: 'edit', icon: 'edit', id: group.id},
          {type: 'delete', name: 'delete', icon: 'delete', id: group.id},
          
        ],
        color: group.color.text,
        backGround: group.color.secondary
        };

        this.cards.push(card);

      });
    });
  }
  back(): void{
    window.history.back();
  }

  removeGroup = (groupID: any) => this.groupService.deleteGroup(groupID);

  clickEvent(button: { type: any; id: string; }){
    const group: Group  = this.groups.find(obj  => {
      return obj.id === button.id;
    });
    if (group){
      switch (button.type) {
        case 'edit':
          this.router.navigate(['/dashboard/update-group/' + button.id]);
          break;
        case 'details':
          this.router.navigate(['/dashboard/group-profile/' + button.id]);
          break;
        case 'delete':
          this.removeGroup(button.id);
          this.router.navigate(['/dashboard/list-group/']);
          break;
        case 'home':
          this.groupService.setGroupCookie(group);
          this.router.navigate(['/dashboard/group-home/' + button.id]);
          break;
        case 'defualt':
              this.groupService.setGroupCookie(group);
              break;
        default:
          break;
      }
    }
  }

}
