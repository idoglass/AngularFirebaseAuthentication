import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
  public editForm: FormGroup;
  groupRef: any;
  header: Header;

  constructor(
    public groupService: GroupService,
    public formBuilder: FormBuilder,
    private act: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: [''],
      color: [''],
      discription: [''],
      manager: ['']
    });
  }

  ngOnInit(): void {
    const id = this.act.snapshot.paramMap.get('id');

    this.groupService.getGroupDoc(id).subscribe(res => {
      this.groupRef = res;
      this.header = {title: 'Edit ' + this.groupRef.name}
      this.editForm = this.formBuilder.group({
        name: [this.groupRef.name],
        color: [this.groupRef.color],
        discription: [this.groupRef.discription],
        manager: [this.groupRef.manager],
      });
    });
  }

  onSubmit(): void {
    const id = this.act.snapshot.paramMap.get('id');

    this.groupService.updateGroup(this.editForm.value, id);
    this.router.navigate(['dashboard/list-group']);
  }

  save(event){
    this.editForm.patchValue({
      color: event
    })
}
}
