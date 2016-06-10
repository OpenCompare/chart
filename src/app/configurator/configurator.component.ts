import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PCMApi} from "../PCMApi";
import {BooleanConfiguratorComponent} from "./boolean-configurator/boolean-configurator.component";
import {NumberConfiguratorComponent} from "./number-configurator/number-configurator.component";
import {StringConfiguratorComponent} from "./string-configurator/string-configurator.component";

@Component({
  moduleId: module.id,
  selector: 'oc-configurator',
  templateUrl: 'configurator.component.html',
  styleUrls: ['configurator.component.css'],
  directives: [BooleanConfiguratorComponent, NumberConfiguratorComponent, StringConfiguratorComponent]
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
      });
    }
  }

}
