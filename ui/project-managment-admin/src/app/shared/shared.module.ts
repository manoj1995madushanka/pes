import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatSidenavModule} from '@angular/material';
import {AddProjectComponent} from "./add-project/add-project.component";

import {ProjectCardComponent} from "./project-card/project-card.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SideNavComponent} from "./side-nav/side-nav.component";
import {DashboardCardHolderComponent} from './dashboard-card-holder/dashboard-card-holder.component';

@NgModule({
  declarations: [
    AddProjectComponent,
    ProjectCardComponent,
    SideNavComponent,
    DashboardCardHolderComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
  ],
  providers: [],
  exports: [
    AddProjectComponent,
    ProjectCardComponent,
    SideNavComponent,
    DashboardCardHolderComponent
  ]
})
export class SharedModule {
}