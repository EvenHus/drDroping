import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import moment = require('moment');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Åpningstider';
  loading: boolean = true;

  data$: Observable<any> = new Observable();
  error$: Observable<any> = new Observable();
  selectedItem: string;

  data: any[] = [];

  days: any[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  openingHours: any[] = [];

  constructor(private _http: HttpClient) {

  }


  ngOnInit(): void {
    this.data$ = this._http.get('https://core.api.drdropin.no/v1/clinics/');

    this.data$.pipe(
      map(data => {
        if (data) {
          this.loading = false;
          this.data = this.handleOpeningHours(data);
          console.log(this.data);
        }
      }),
      catchError((error) => this.error$ = error),
    ).subscribe();

  }


  handleOpeningHours(data: any): any {
    return data.map(item => {
      const openingHours = [];
      this.days.map(day => {
        const hours = item.openingHours[day].periods[0];
        if (hours) {

          const to = moment(hours.to).format('HH');
          const from = moment(hours.from).format('HH');

          if (!openingHours[day]) {
            openingHours[day] = from + '-' + to;
          }
        }
      });

      return Object.assign({}, item, {hours: openingHours});
    });
  }

  clickElem(args: any, item): any {
    console.log(item);
    if (this.selectedItem === item.id) {
      this.selectedItem = '';
    } else {
      this.selectedItem = item.id;
    }

  }
}
