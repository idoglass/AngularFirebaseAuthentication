import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from '../user.model';
import { Group } from './group.model';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
group: Group;
redirectUrl: string;


// Observable navItem source
private _groupSource = new BehaviorSubject<Group>(new Group());
// Observable navItem stream
group$ = this._groupSource.asObservable();


  constructor(private angularFirestore: AngularFirestore, private router: Router) {
    this.group = JSON.parse(localStorage.getItem('group'));
    this._groupSource.next(this.group)
  }

  // service command
changeGroup(group: Group) {
  this._groupSource.next(group);
  this.redirectUrl ? this.router.navigate([this.redirectUrl]) :
  this.router.navigate(['dashboard/group-home/' + group.id]);
  this.redirectUrl = null;
}


  getGroupDoc(id) {
    const ref =  this.angularFirestore
    .collection('groups')
    .doc(id)
    .valueChanges();
    return ref
  }

  getGroupList(userID) {
    if (userID === 'all'){
    return this.angularFirestore
    .collection('groups')
    .snapshotChanges();
    }
    if (userID !== 'all' && userID){
      return this.angularFirestore
      .collection('groups', ref => ref
      .where(userID + '.status', '==', 'true' ))
      .snapshotChanges();
      }
  }

  createGroup(group: Group, user: User) {

    return this.angularFirestore
        .collection('groups')
        .add(group)
        .then(response => {
          console.log('createGroup res: ', response.get());
          this.updateGroupUser(user, response.id, 'manager', 'true');
          return response;
        }).catch(error => error);

  }

  deleteGroup(groupID) {
    return this.angularFirestore
      .collection('groups')
      .doc(groupID)
      .delete();
  }

  updateGroup(group: Group, id) {
    return this.angularFirestore
      .collection('groups')
      .doc(id)
      .update({
        name: group.name,
        manager: group.manager,
        color: group.color,
        discription: group.discription
      });
  }

  updateGroupUser(user: User, gid, role, status){
    console.log(user, gid, role, status)

    const data = {};
    data[user.uid] = {name: '', email: user.email, role, status };
    if (user.displayName) { data[user.uid] = {name: user.displayName, email: user.email, role, status }; }
    if (user.name) { data[user.uid] = {name: user.name,email: user.email, role, status }; }
    return this.angularFirestore
      .collection('groups')
      .doc(gid)
      .update( data);

  }
  createPendingUser(gid, email, status) {
    const name = email.split('@')
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
      .collection('groups/' + gid + '/pending')
      .doc(gid + '_' + name[0])
        .set({
          email,
          status,
          name: name[0]
        })
        .then(response => {
          console.log(response);
        }, error => reject(error));
    });
  }



  getPendingUserList(gid) {
      return this.angularFirestore
      .collection('groups/' + gid + '/pending')
      .snapshotChanges();
      }

      deletePendingUser(gid, id) {
        return this.angularFirestore
          .collection('groups/' + gid + '/pending')
          .doc(gid + '_' + id)
          .delete();
      }


      setGroupCookie(group: Group): void{
        localStorage.setItem('group', JSON.stringify(group));
        JSON.parse(localStorage.getItem('group'));
        this.changeGroup(group);
      }

      get getGroup(): Group {
        return this.group;
      }
  }

