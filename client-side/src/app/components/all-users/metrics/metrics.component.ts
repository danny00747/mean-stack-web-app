import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {


  searchValue : string = "";

  users: any;
  totalItems: number;
  page: number = 1;

  constructor(private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.showUsersLogs();
  }

  showUsersLogs() {

    let tab: Array<any> = [];

    this.authService.getLogs()
      .toPromise()
      .then((data: any) => {
        data
          .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
          .forEach(x => {
            x.date = new Date(x.date);
          });
        this.users = data;
        this.totalItems = this.users.length;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
