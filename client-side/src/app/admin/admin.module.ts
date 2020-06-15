import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from "@angular/router";
import { SharedModule } from "../shared/shared.module";

import {AllQuestionsComponent} from "./components/all-questions/all-questions.component";
import {UsersTableComponent} from "./components/users-table/users-table.component";
import {MetricsComponent} from "./components/metrics/metrics.component";
import {AllUsersComponent} from "./components/all-users/all-users.component";


const appRoutes : Routes = [
  { path: "questions/all", component: AllQuestionsComponent},
  { path: "users/info", component: UsersTableComponent},
  { path: "users/metrics", component: MetricsComponent},
  { path: "users/all", component: AllUsersComponent},
];

@NgModule({
  declarations: [
    AllQuestionsComponent,
    UsersTableComponent,
    MetricsComponent,
    AllUsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class AdminModule { }
