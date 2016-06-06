import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  products : any[];
  productHover : any;

  numericalFeatures : any[];

  chartDiv: HTMLDivElement;

  constructor(private http: Http, private ref: ChangeDetectorRef) {

  };

  ngOnInit() {
    // this.http.get("http://localhost:9000/api/get/5667063878c2faf9781b6f80")
    this.http.get("http://localhost:9000/api/get/5667065078c2faf9781b7271")
      .map(r => r.json())
      .subscribe(response => {

        this.chartDiv = <HTMLDivElement> document.getElementById('chart');

        // Load PCM
        this.pcmContainer = response;
        this.pcmContainer.pcm = this.pcmApi.loadPCMModelFromString(JSON.stringify(response.pcm));
        this.pcmApi.decodePCM(this.pcmContainer.pcm);

        // Filter numerical features
        this.numericalFeatures = this.pcmContainer.pcm.features.array.filter((feature) => {
          let type = this.pcmApi.getMainTypeOfFeature(feature);
          return type === "org.opencompare.model.IntegerValue" || type === "org.opencompare.model.DoubleValue";
        });



        if (this.numericalFeatures.length > 0) {
          // Initialize axes
          this.xAxis = this.numericalFeatures[0];
          this.yAxis = this.numericalFeatures[0];
          this.size = this.numericalFeatures[0];
          this.color = this.numericalFeatures[0];

          // Initialize chart
          this.updateChart();
        }

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

    let rawSizes = this.getValues(products, this.size).map((value) => parseFloat(value));
    let sizes = rawSizes.map((value) =>(value - Math.min(...rawSizes)) / (Math.max(...rawSizes) - Math.min(...rawSizes)));

    let rawColors: number[] = this.getValues(products, this.color).map((value) => parseFloat(value));
    let colors = rawColors.map((value) => (value - Math.min(...rawColors)) / (Math.max(...rawColors) - Math.min(...rawColors)));

    var data = [{
      name: "Products",
      text: this.getProductNames(products),
      marker: {
        sizemode: "area",
        sizemin: 2,
        sizeref: 0.001,
        size : sizes,
        colorscale: [[0,'rgb(0,255,0,1)'], [0.5,'rgb(255,165,0,1)'], [1,'rgba(255,0,0,1)']],
        color: colors
      },
      mode: "markers",
      x: this.getValues(products, this.yAxis),
      y: this.getValues(products, this.xAxis)
    }];

    var layout = {
      // title: this.pcmContainer.pcm.name,
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

    (<any>this.chartDiv).on('plotly_hover', (data) => {
      let productName = data.points[0].data.text[data.points[0].pointNumber];
      this.productHover = this.pcmContainer.pcm.productsKey.cells.array.find((cell) => cell.content === productName).product;
      this.ref.detectChanges();
    });

    (<any>this.chartDiv).on('plotly_unhover', (data) => {
      this.productHover = null;
      this.ref.detectChanges();
    });

  }

}
