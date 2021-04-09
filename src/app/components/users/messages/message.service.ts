import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from './message.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';
import { concat, merge } from 'rxjs';
import { User } from '../user.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private angularFirestore: AngularFirestore) {}

  getMessageDoc(id) {
    return this.angularFirestore
    .collection('messages')
    .doc(id)
    .valueChanges();
  }

  getMessageList(user: any) {
    const userRecieved = this.getInbox(user);
    const userSend = this.getSent(user);

    return  combineLatest([userSend, userRecieved]).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    );
  }

  getInbox(user: any){
    return this.angularFirestore
    .collection('messages/' + this.getID(user) + '/messages', ref => ref
      .where('reciver', 'array-contains', user )
      .orderBy('date', 'desc'))
    .snapshotChanges();
  }

  getSent(user: any){
    return this.angularFirestore
    .collection('messages/' + this.getID(user) + '/messages', ref => ref
      .where('sender', '==', user )
      .orderBy('date', 'desc'))
    .snapshotChanges();
  }

  createMessage(message: Message) {
    message.new = false;

    const sender = new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection('messages/' + this.getID(message.sender) + '/messages')
        .add(message)
        .then(response => { console.log(response); }, error => reject(error));
    });
    message.new = true;
    const reciverList = [];
    console.log(message.reciver)
    message.reciver.forEach(reciver =>{
      reciverList.push( new Promise<any>((resolve, reject) => {
        this.angularFirestore
        .collection('messages/' + this.getID(reciver) + '/messages')
          .add(message)
          .then(response => { console.log(response); }, error => reject(error));
      }));
    })

    return {sender, reciver: reciverList}

  }

  getID(email: any): string{
    const arrayEmail = email.split('.');
    const str = arrayEmail.join('');

    return str;
        }

  deleteMessage(message, email) {
    return this.angularFirestore
      .collection('messages/' + this.getID(email) + '/messages')
      .doc(message.id)
      .delete();
  }

  markAsRead(message, isNew: boolean, email) {
    return this.angularFirestore
      .collection('messages/' + this.getID(email) + '/messages')
      .doc(message.id)
      .update({new: isNew});
  }

}
