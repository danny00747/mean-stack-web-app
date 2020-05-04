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
    let t1: Array<any> = [];
    let t2: Array<any> = [];

    this.authService.getLogs()
      .toPromise()
      .then((data: any) => {

        t2 = data.filter(x => x.type === 'Incoming');
        t1 = data.filter(x => x.type === 'Outgoing');

        t2.filter((x,i) => x.requestId === t1[i].requestId)
          .forEach((x, i) =>
            tab.push(
              {"host" : x.host, "level" : x.level, "response" : t1[i].response,
                "status" : t1[i].status, "method" : x.method, "url" : x.url,
                "date" : x.date}));

        tab
          .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
          .forEach(x => {
            x.date = new Date(x.date);
          });
        this.users = tab;
        this.totalItems = this.users.length;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
