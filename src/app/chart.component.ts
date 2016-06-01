import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {PCMApi} from "./PCMApi";

declare var Plotly: any;

@Component({
  moduleId: module.id,
  selector: 'chart-app',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartAppComponent implements OnInit {

  pcmApi = new PCMApi();
  pcmContainer : any;

  xAxis : any;
  yAxis : any;
  size : any;
  color : any;

  chartDiv: HTMLDivElement;

  constructor(private http: Http) {

  };

  ngOnInit() {
    this.http.get("http://localhost:9000/api/get/5667063678c2faf9781b6f64")
      .map(r => r.json())
      .subscribe(response => {

        this.pcmContainer = response;
        this.pcmContainer.pcm = this.pcmApi.loadPCMModelFromString(JSON.stringify(response.pcm));
        this.pcmApi.decodePCM(this.pcmContainer.pcm);

        this.chartDiv = <HTMLDivElement> document.getElementById('chart');
        let features = this.pcmContainer.pcm.features.array;
        this.xAxis = features[0];
        this.yAxis = features[1];
        this.size = features[2];
        this.color = features[3];

        this.updateChart();
      });
  }

  changeXAxis(event) {
    this.xAxis = event;
    this.updateChart();

  }

  changeYAxis(event) {
    this.yAxis = event;
    this.updateChart();

  }

  changeSize(event) {
    this.size = event;
    this.updateChart();
  }

  changeColor(event) {
    this.color = event;
    this.updateChart();
  }

  listProducts() {
    return this.pcmContainer.pcm.products.array;
  }

  getProductNames(products) {
    let productNames = [];
    products.forEach((product) =>
      productNames.push(this.pcmApi.getProductsKey(product, this.pcmContainer.pcm.productsKey))
    );
    return productNames;
  }

  getValues(products, feature) {
    let values = [];
    products.forEach((product) => values.push(this.pcmApi.findCell(product, feature).content));
    return values;
  }

  updateChart() {

    let products = this.listProducts();

    let sizes = this.getValues(products, this.size);
    let maxSize = 0;
    sizes.forEach((size) => {
      let parsedSize = parseFloat(size);
      if (parsedSize > maxSize) {
        maxSize = parsedSize
      }
    });

    var data = [{
      name: "Products",
      text: this.getProductNames(products),
      marker: {
        sizemode: "area",
        sizeref: maxSize,
        size : sizes
      },
      mode: "markers",
      x: this.getValues(products, this.yAxis),
      y: this.getValues(products, this.xAxis),
      uid: "99da6d"
    }];

    var layout = {
      xaxis: {
        title: this.xAxis.name
      },
      yaxis: {
        title: this.yAxis.name
      },
      margin: {
        t: 20
      },
      hovermode: 'closest'
    };

    Plotly.newPlot(this.chartDiv, data, layout);
  }
}
