import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { DiningComponent } from './components/dining/dining.component';
import { EventComponent } from './components/event/event.component';
import { EventCreateComponent } from './components/events/event-create.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ClassComponent } from './components/class/class.component';
import {FriendsComponent} from './components/friends/friends.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { GensearchComponent } from './components/gensearch/gensearch.component';
import { StudygroupComponent } from './components/studygroup/studygroup.component';
import { EventPageComponent } from './components/eventPage/event-page.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {EventEditComponent} from './components/eventEdit/event-edit.component';


const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch: 'full' },
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'profile', component:ProfileComponent},
  {path:'home', component:HomeComponent},
  {path:'dining', component:DiningComponent},
  {path:'event', component:EventComponent}, //Event Creation
  {path:'eventPage', component:EventPageComponent}, //Event Viewing
  {path:'eventEdit', component:EventEditComponent}, //Event editing
  {path:'schedule', component:ScheduleComponent},
  {path: 'class', component: ClassComponent},
  {path: 'friends', component: FriendsComponent},
  {path: 'messaging', component: MessagingComponent},
  {path: 'gensearch', component: GensearchComponent},
  {path: 'studygroup', component: StudygroupComponent},
  {path: 'navbar', component: NavbarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
