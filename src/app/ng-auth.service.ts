import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from './components/users/user.model';
import { UserService } from './components/users/user.service';


@Injectable({
  providedIn: 'root'
})

export class NgAuthService {
    userState: any;
    redirectUrl: string;

    constructor(
      public afs: AngularFirestore,
      public afAuth: AngularFireAuth,
      public router: Router,
      public ngZone: NgZone,
      private userService: UserService
    ) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userState = user;
          localStorage.setItem('user', JSON.stringify(user));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      });
    }

    SignIn(email, password) {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.SetUserData(result.user).then(e => {
            this.ngZone.run(() => {
              // this.router.navigate(['dashboard']);
              this.router.navigateByUrl(this.redirectUrl || '/dashboard');
              console.log('sign in');
            });
          });
        }).catch((error) => {
          window.alert(error.message);
        });
    }

    SignUp(email, password) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          const name = result.user.email.split('@');
          result.user.updateProfile({
            displayName: name[0],
            photoURL: '/assets/user.svg'
          }).then(function() {
            // Update successful.
            console.log('display name is ' + name[0])

          }).catch(function(error) {
            // An error happened.
          });
          this.SendVerificationMail();
          this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error.message);
        });
    }

    SendVerificationMail() {
        return this.afAuth.currentUser.then(u => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['email-verification']);
        });
    }

    ForgotPassword(passwordResetEmail) {
      return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
    }

    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null && user.emailVerified !== false) ? true : false;
    }

    GoogleAuth() {
      return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
    }

    AuthLogin(provider) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.SetUserData(result.user).then(e => {
          this.ngZone.run(() => {
            console.log('log in');
              // this.router.navigate(['dashboard']);
            this.router.navigateByUrl(this.redirectUrl || '/dashboard');
           });
        });

      }).catch((error) => {
        window.alert(error);
      });
    }

    SetUserData(user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userState: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };

      console.log(userState, '-------------------user state---------------');
      console.log(typeof(userState));
      return userRef.set(userState, {
        merge: true
      });
    }

    SignOut() {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('group');
        this.router.navigate(['sign-in']);
      });
    }
    deleteUser(){
      const cuser = firebase.auth().currentUser;

      cuser.delete().then( data => {
        this.userService.deleteUser(cuser).then();
        localStorage.removeItem('user');
        this.router.navigate(['sign-up']);
      }).catch((error) => {
        // An error happened.
      });
    }

    updateProfile(userData: User): void {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: userData.displayName,
        photoURL: userData.photoURL
      }).then(function() {
        // Update successful.
        console.log('Update successful.')
        this.SetUserData(user);
        user.photoURL = userData.photoURL;
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));
      }).catch(function(error) {
        // An error happened.
      });
    }

}
