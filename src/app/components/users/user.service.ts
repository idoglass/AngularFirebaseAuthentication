import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private angularFirestore: AngularFirestore) {}

  getUserDoc(id) {
    return this.angularFirestore
    .collection('users')
    .doc(id)
    .valueChanges();
  }

  getUserList() {
    return this.angularFirestore
    .collection('users')
    .snapshotChanges();
  }

  createUser(user: User) {
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection('users')
        .add(user)
        .then(response => { console.log(response); }, error => reject(error));
    });
  }

  deleteUser(user) {
    return this.angularFirestore
      .collection('users')
      .doc(user.uid)
      .delete();
  }

  updateUser(user: User, id) {
    return this.angularFirestore
      .collection('users')
      .doc(id)
      .update({
        displayName: user.displayName,
        email: user.email,
        birthday: user.birthday
      });
  }

  
}
