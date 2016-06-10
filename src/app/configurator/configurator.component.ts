import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PCMApi} from "../PCMApi";
import {BooleanConfiguratorComponent} from "./boolean-configurator/boolean-configurator.component";
import {IntegerConfiguratorComponent} from "./integer-configurator/integer-configurator.component";

@Component({
  moduleId: module.id,
  selector: 'oc-configurator',
  templateUrl: 'configurator.component.html',
  styleUrls: ['configurator.component.css'],
  directives: [BooleanConfiguratorComponent, IntegerConfiguratorComponent]
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

}
