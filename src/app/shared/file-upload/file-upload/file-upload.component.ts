import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { User } from 'src/app/components/users/user.model';


@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
  })


    export class FileUploadComponent implements OnInit {
      @Input() photoURL: string;
      @Output() uploadEvent = new EventEmitter();

      user: User;
      title = 'cloudsSorage';
      selectedFile: File = null;
      fb;
      downloadURL: Observable<string>;
      prc = 0;
      isUploading = false;
      constructor(
        private storage: AngularFireStorage,
       ) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
      ngOnInit() {}

      onFileSelected(event) {
        this.isUploading = true;
        var n = Date.now();
        const file = event.target.files[0];
        const filePath = `profileImages/${this.user.uid + '_' + n}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`profileImages/${this.user.uid + '_' + n}`, file);
        task.percentageChanges().subscribe(n =>  this.prc = n)
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                if (url) {
                  this.fb = url;
                }
                console.log(this.fb);
                this.isUploading = false;
                this.photoURL = this.fb;
                this.uploadEvent.emit(this.fb);
              });
            })
          )
          .subscribe(url => {
            if (url) {
              console.log(url);
            }
          });
      }
    }