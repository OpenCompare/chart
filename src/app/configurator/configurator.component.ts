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
        switch(type) {
          case "BooleanValue" :
                break;
          case "IntegerValue" :
                // TODO : compute min and max
                break;
          default :

        }
      });

      // TODO : get values to display in the choices when necessary
      // TODO : add listener to filter products depending on the user choices

    }
  }

  filter(feature, value) {
    switch(feature.type) {
      case "BooleanValue" : // FIXME : checkbox is not enough to represent a filter for boolean, we need an undefined state
        if (value) {
          // TODO : display only product that contain the feature
        } else {
          // TODO : the inverse
        }
        break;
      case "IntegerValue" :
        break;
      default :

    }
  }
}
