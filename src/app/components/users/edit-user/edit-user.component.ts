import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { NgAuthService } from 'src/app/ng-auth.service';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})

export class EditUserComponent implements OnInit {

  public editForm: FormGroup;
  userRef: any;
  header: Header;


  constructor(
    public userService: UserService,
    public formBuilder: FormBuilder,
    private act: ActivatedRoute,
    private router: Router,
    private auth: NgAuthService

  ) {
    this.editForm = this.formBuilder.group({
      displayName: [''],
      email: [''],
      birthday: [''],
      photoURL: ['']
    });
  }

  ngOnInit(): void {
    const id = this.act.snapshot.paramMap.get('id');

    this.header = {title: 'Edit '};

    this.userService.getUserDoc(id).subscribe(res => {
      this.userRef = res;
      this.editForm = this.formBuilder.group({
        displayName: [this.userRef.displayName],
        email: [this.userRef.email],
        birthday: [this.userRef.birthday],
        photoURL: [this.userRef.photoURL]
      });
    });
  }

  onSubmit(): void {
    console.log(this.editForm.value);

    const id = this.act.snapshot.paramMap.get('id');

    this.userService.updateUser(this.editForm.value, id);
    this.auth.updateProfile(this.editForm.value)
    this.router.navigate(['/dashboard/profile']);
  }
  
}
