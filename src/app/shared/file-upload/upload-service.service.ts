import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs/internal/Observable';

import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  private basePath = '/uploads';

  constructor( private storage: AngularFireStorage) { }


  pushFileToStorage(fileUpload: FileUpload) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;

        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }




}
export class FileUpload {
  key: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}