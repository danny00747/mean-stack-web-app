import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddClassDirective } from './directives/add-class.directive';
import { AllQuestionsComponent } from './components/all-users/all-questions/all-questions.component';
import { MinNavBArComponent } from './components/navbar/min-nav-bar/min-nav-bar.component';
import { UsersTableComponent } from './components/all-users/users-table/users-table.component';
import { ValidInputDirective } from './directives/valid-input.directive';
import {AgGridModule} from "ag-grid-angular";
import { FilterPipe } from './pipes/filter.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import {TimeAgoPipe} from 'time-ago-pipe';
import { MetricsComponent } from './components/all-users/metrics/metrics.component';

import { TruncatePipe } from '../pipes/truncate.pipe.spec';
import { FilterLogsPipe } from './pipes/filter-logs.pipe';



@NgModule({
  declarations: [
    TruncatePipe,

  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
