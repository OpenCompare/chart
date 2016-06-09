import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PCMApi} from "../PCMApi";

@Component({
  moduleId: module.id,
  selector: 'oc-configurator',
  templateUrl: 'configurator.component.html',
  styleUrls: ['configurator.component.css']
})
export class ConfiguratorComponent implements OnInit, OnChanges {

  pcmApi = new PCMApi();

  @Input() pcmContainer : any;
  features : any[]= [];

  constructor() {}

  ngOnInit() {

  }


  ngOnChanges(changes:{}):any {
    if (typeof this.pcmContainer !== "undefined") {
      this.features = this.pcmContainer.pcm.features.array;
      
      // Compute main type of features in order to create specialized inputs
      this.features.forEach((feature) => {
        let type = this.pcmApi.getMainTypeOfFeature(feature);
        feature.type = type.substring("org.opencompare.model.".length);
        switch(feature.type) {
          case "BooleanValue" :
            break;
          case "IntegerValue" :
            let integerCells = feature.cells.array.filter((cell) => {
              let interpretation = cell.interpretation;
              return typeof interpretation !== "undefined" &&
                interpretation !== null &&
                interpretation.metaClassName() === "org.opencompare.model.IntegerValue"
            });
            let values = integerCells.map((cell) => cell.interpretation.value);
            feature.min = Math.min(...values);
            feature.max = Math.max(...values);
            break;
          default :

        }
      });

      // TODO : get values to display in the choices when necessary
      // TODO : add listener to filter products depending on the user choices

    }
  }

  uniqueValues(feature) : Set<string> {
    let uniqueValues = new Set<string>();
    feature.cells.array.forEach((cell) => uniqueValues.add(cell.content));
    return uniqueValues;
  }

  filterBoolean(feature, value) {
    // FIXME : checkbox is not enough to represent a filter for boolean, we need an undefined state
    let products = this.pcmContainer.pcm.products.array;
    products.forEach((product: {filtered : boolean}) => {
      let cell = this.pcmApi.findCell(product, feature);
      product.filtered = cell.interpretation.value === value;
    });
  }


}
