import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {PCMApi} from "./PCMApi";

@Component({
  moduleId: module.id,
  selector: 'chart-app',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartAppComponent implements OnInit {

  pcmApi = new PCMApi();
  pcmContainer : any;

  constructor(private http: Http) {

  };

  ngOnInit() {
    this.http.get("http://localhost:9000/api/get/5667063678c2faf9781b6f64")
      .map(r => r.json())
      .subscribe(response => {

        this.pcmContainer = response;
        this.pcmContainer.pcm = this.pcmApi.loadPCMModelFromString(JSON.stringify(response.pcm));
        this.pcmApi.decodePCM(this.pcmContainer.pcm);
        console.log(this.pcmContainer.pcm.products.array);
        console.log(this.pcmContainer.pcm.productsKey.name);
      });
  }

}
