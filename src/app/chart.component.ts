import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'chart-app',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartAppComponent {

  constructor(private http: Http) {
    http.get("http://localhost:9000/api/get/5667063678c2faf9781b6f64")
      .map(r => r.json())
      .subscribe(response => console.log(response));
  };

  title = 'chart works!';
}
