import {
  Component, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChange, Output, Renderer,
  ElementRef, DoCheck
} from '@angular/core';
import {Http} from "@angular/http";
import {PCMApi} from "../PCMApi";
import {EventEmitter} from "@angular/compiler/src/facade/async";

declare var Plotly: any;

@Component({
  moduleId: module.id,
  selector: 'oc-product-chart',
  templateUrl: 'product-chart.component.html',
  styleUrls: ['product-chart.component.css']
})
export class ProductChartComponent implements OnInit, OnChanges, DoCheck {

  pcmApi = new PCMApi();
  @Input() pcmContainer : any;
  @Output() selectedProduct = new EventEmitter();

  xAxis : any;
  yAxis : any;
  size : any;
  color : any;
  products : any[];

  numericalFeatures : any[];

  chartDiv: HTMLDivElement;

  constructor(private ref: ChangeDetectorRef, private renderer: Renderer, private elementRef : ElementRef) {

  }

  ngOnInit() {

  }


  ngOnChanges(changes:{[propName: string]: SimpleChange}) {
    this.updatePCM();
  }


  ngDoCheck() {
    this.updatePCM();
  }

  updatePCM() {
    if (typeof this.pcmContainer !== "undefined") {
      this.chartDiv = <HTMLDivElement> document.getElementById('chart');

      this.products = this.pcmContainer.pcm.products.array.filter((product) => typeof product.filtered === "undefined" || !product.filtered);

      // Filter numerical features
      this.numericalFeatures = this.pcmContainer.pcm.features.array.filter((feature) => {
        let type = this.pcmApi.getMainTypeOfFeature(feature);
        return type === "org.opencompare.model.IntegerValue" || type === "org.opencompare.model.RealValue";
      });



      if (this.numericalFeatures.length > 0) {
        // Initialize axes
        this.xAxis = this.numericalFeatures[1];
        this.yAxis = this.numericalFeatures[3];
        this.size = this.numericalFeatures[2];
        this.color = this.numericalFeatures[4];

        // Initialize chart
        this.updateChart();
      }

    }
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

  getProductNames(products) {
    let productNames = [];
    products.forEach((product) =>
      productNames.push(this.pcmApi.getProductsKey(product, this.pcmContainer.pcm.productsKey))
    );
    return productNames;
  }

  getValues(products, feature) {
    let values = [];
    products.forEach((product) => {
      let cell = this.pcmApi.findCell(product, feature);
      if (typeof cell.interpretation !== "undefined" && this.pcmApi.isNumericalInterpretation(cell.interpretation)) {
        values.push(cell.interpretation.value)
      } else {
        values.push(-1)
      }

    });
    return values;
  }

  updateChart() {

    let rawSizes = this.getValues(this.products, this.size).map((value) => parseFloat(value));
    let sizes = rawSizes.map((value) =>(value - Math.min(...rawSizes)) / (Math.max(...rawSizes) - Math.min(...rawSizes)));

    let rawColors: number[] = this.getValues(this.products, this.color).map((value) => parseFloat(value));
    let colors = rawColors.map((value) => (value - Math.min(...rawColors)) / (Math.max(...rawColors) - Math.min(...rawColors)));

    var data = [{
      name: "Products",
      text: this.getProductNames(this.products),
      marker: {
        sizemode: "area",
        sizemin: 2,
        sizeref: 0.001,
        size : sizes,
        colorscale: [[0,'rgb(0,255,0,1)'], [0.5,'rgb(255,165,0,1)'], [1,'rgba(255,0,0,1)']],
        color: colors
      },
      mode: "markers",
      x: this.getValues(this.products, this.xAxis),
      y: this.getValues(this.products, this.yAxis)
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
      let productHover = this.pcmContainer.pcm.productsKey.cells.array.find((cell) => cell.content === productName).product;
      this.selectedProduct.emit(productHover);
      this.ref.detectChanges();
    });

    (<any>this.chartDiv).on('plotly_unhover', (data) => {
      this.ref.detectChanges();
    });

  }

}
