import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { User } from '../../user.model';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  public groupForm: FormGroup;
  user: User;
  header: Header;
  constructor(
    public groupService: GroupService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.groupForm = this.formBuilder.group({
      name: [''],
      color: [''],
      discription: [''],
      manager: [this.user.uid]
    });
  }

  ngOnInit(): void {
    this.header = {title: 'Creat New Group '};
  }

  onSubmit(): void {
    this.groupService.createGroup(this.groupForm.value, this.user).then(res => {
      console.log(res,' is res')
      this.groupService.getGroupDoc(res.id).subscribe(res1 => { 
        this.groupService.setGroupCookie(res1 as Group)
      });
      this.router.navigate(['dashboard/group-home/' + res.id]);
    });
  }

    save(event) {
        this.groupForm.patchValue({
          color: event
        });
      }
}
