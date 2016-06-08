import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {ConfiguratorComponent} from "./configurator/configurator.component";
import {ProductChartComponent} from "./product-chart/product-chart.component";
import {PCMApi} from "./PCMApi";
import {ProductDetailsComponent} from "./product-details/product-details.component";

@Component({
  moduleId: module.id,
  selector: 'chart-app',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css'],
  directives: [ConfiguratorComponent, ProductChartComponent, ProductDetailsComponent]
})
export class ChartAppComponent implements OnInit {

  pcmApi = new PCMApi();
  pcmContainer : any;
  selectedProduct : any;

  constructor(private http: Http) {

  };

  ngOnInit() {
    this.http.get("http://localhost:9000/api/get/5756e926d244ba0353d2cebc")
      .map(r => r.json())
      .subscribe(response => {

        // Load PCM
        this.pcmContainer = response;
        this.pcmContainer.pcm = this.pcmApi.loadPCMModelFromString(JSON.stringify(this.pcmContainer.pcm));
        this.pcmApi.decodePCM(this.pcmContainer.pcm);

      });
  }


  changeSelectedProduct(event) {
    this.selectedProduct = event;
  }



}
