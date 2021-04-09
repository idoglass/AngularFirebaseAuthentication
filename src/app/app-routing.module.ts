import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';

import { AuthGuard } from './auth.guard';
import { NoGroupGuard } from './shared/no-group.guard';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ListUserComponent } from './components/users/list-user/list-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';

import { UserProfileComponent } from './components/users/user-profile/user-profile.component';

import { CreateMessageComponent } from './components/users/messages/create-message/create-message.component';
import { MessageListComponent } from './components/users/messages/message-list/message-list.component';

import { CreateGroupComponent } from './components/users/group/create-group/create-group.component';
import { EditGroupComponent } from './components/users/group/edit-group/edit-group.component';
import { GroupProfileComponent } from './components/users/group/group-profile/group-profile.component';
import { ListGroupComponent } from './components/users/group/list-group/list-group.component';
import { SettingsComponent } from './components/users/settings/settings.component';
import { NoGroupComponent } from './components/users/group/no-group/no-group.component';
import { JoinComponent } from './components/users/group/join/join.component';
import { GroupHomeComponent } from './components/users/group/group-home/group-home.component';
import { HelpComponent } from './components/help/help.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/profile', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'join/group/:id', component: JoinComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]  },
      { path: 'help', component: HelpComponent, canActivate: [AuthGuard]  },
      { path: 'no-group', component: NoGroupComponent, canActivate: [AuthGuard]  },
      { path: 'list-users', component: ListUserComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'update-user/:id', component: EditUserComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]  },
      { path: 'create-message', component: CreateMessageComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'list-messages', component: MessageListComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'create-group', component: CreateGroupComponent, canActivate: [AuthGuard]  },
      { path: 'list-group', component: ListGroupComponent, canActivate: [AuthGuard]  },
      { path: 'update-group/:id', component: EditGroupComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'group-profile/:id', component: GroupProfileComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: 'group-home/:id', component: GroupHomeComponent, canActivate: [AuthGuard, NoGroupGuard]  },
      { path: '**' , component: GroupHomeComponent, canActivate: [AuthGuard, NoGroupGuard]  },
    ] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-verification', component: VerifyEmailComponent },
  { path: '**', component: DashboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

