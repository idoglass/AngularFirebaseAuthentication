import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {    MaterialModule } from './shared/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';


import { environment } from '../environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';

import { NgAuthService } from './ng-auth.service';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ListUserComponent } from './components/users/list-user/list-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { MessageListComponent } from './components/users/messages/message-list/message-list.component';
import { CreateMessageComponent } from './components/users/messages/create-message/create-message.component';
import { CreateGroupComponent } from './components/users/group/create-group/create-group.component';
import { ListGroupComponent } from './components/users/group/list-group/list-group.component';
import { EditGroupComponent } from './components/users/group/edit-group/edit-group.component';
import { GroupProfileComponent } from './components/users/group/group-profile/group-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './components/users/settings/settings.component';


import { CardComponent } from './shared/card/card.component';
import { PageHeaderComponent } from './shared/page-header/page-header.component';
import { NoGroupComponent } from './components/users/group/no-group/no-group.component';
import { ColorChooserComponent } from './shared/color-chooser/color-chooser.component';

import { JoinComponent } from './components/users/group/join/join.component';
import { GroupHomeComponent } from './components/users/group/group-home/group-home.component';
import { HelpComponent } from './components/help/help.component';
import { ServiceWorkerModule } from '@angular/service-worker';


import { FileUploadComponent } from './shared/file-upload/file-upload/file-upload.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    CreateUserComponent,
    ListUserComponent,
    EditUserComponent,
    UserProfileComponent,
    MessageListComponent,
    CreateMessageComponent,
    CreateGroupComponent,
    ListGroupComponent,
    EditGroupComponent,
    GroupProfileComponent,
    SettingsComponent,
    CardComponent,
    PageHeaderComponent,
    NoGroupComponent,
    ColorChooserComponent,
    JoinComponent,
    GroupHomeComponent,
    HelpComponent,
    FileUploadComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebae),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production, registrationStrategy: 'registerImmediately'
    })

  ],
  providers: [
    NgAuthService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }


