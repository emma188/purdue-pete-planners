import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { EventCreateComponent } from './components/events/event-create.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog'

import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { DiningComponent } from './components/dining/dining.component';
import { EventComponent } from './components/event/event.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { ScheduleComponent } from './components/schedule/schedule.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {ClassComponent} from './components/class/class.component';
import {FriendsComponent} from './components/friends/friends.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { GensearchComponent } from './components/gensearch/gensearch.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StudygroupComponent } from './components/studygroup/studygroup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { messagingService } from './messaging.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { EventPageComponent } from './components/eventPage/event-page.component';
import {EventEditComponent} from './components/eventEdit/event-edit.component';
import { messagingService } from './messaging.service';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TableComponent,
    NavbarComponent,
    ProfileComponent,
    HomeComponent,
    DiningComponent,
    EventComponent,
    ScheduleComponent,
    EventCreateComponent,
    EventPageComponent,
    LoginComponent,
    RegisterComponent,
    ClassComponent,
    FriendsComponent,
    MessagingComponent,
    GensearchComponent,
    StudygroupComponent,
    EventEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    FullCalendarModule,
    MatRadioModule,
    MatButtonModule,
    MatPaginatorModule,
    NgbModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule
  ],

  providers: [messagingService],

  bootstrap: [AppComponent]
})
export class AppModule { }
