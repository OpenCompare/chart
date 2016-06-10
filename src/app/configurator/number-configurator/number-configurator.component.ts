import {Component, OnInit, Input, OnChanges, SimpleChange, ChangeDetectionStrategy} from '@angular/core';
import {PCMApi} from "../../PCMApi";

@Component({
  moduleId: module.id,
  selector: 'oc-number-configurator',
  templateUrl: 'number-configurator.component.html',
  styleUrls: ['number-configurator.component.css'],
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class NumberConfiguratorComponent implements OnInit, OnChanges {

  @Input() feature: any;
  @Input() products: any[];

  pcmApi = new PCMApi();

  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;

  constructor() {}

  ngOnInit() {

  }

  ngOnChanges(changes:{[key: string]: SimpleChange}) {
    if (typeof changes["feature"] !== "undefined" && typeof this.feature !== "undefined") {
      let numberCells = this.feature.cells.array.filter((cell) => {
        let interpretation = cell.interpretation;
        return typeof interpretation !== "undefined" &&
          interpretation !== null &&
          (interpretation.metaClassName() === "org.opencompare.model.IntegerValue" ||
          interpretation.metaClassName() === "org.opencompare.model.RealValue")
      });
      let values = numberCells.map((cell) => cell.interpretation.value);
      this.min = Math.min(...values);
      this.max = Math.max(...values);
      this.selectedMin = this.min;
      this.selectedMax = this.max;
    }
  }

  updateMin(value) {
    this.selectedMin = value;
    this.update();
  }

  updateMax(value) {
    this.selectedMax = value;
    this.update();
  }

  update() {
    this.products.forEach((product: {filtered : boolean}) => {
      let cell = this.pcmApi.findCell(product, this.feature);
      let value = cell.interpretation.value;
      product.filtered = value < this.selectedMin || this.selectedMax < value;
    });
  }
}
