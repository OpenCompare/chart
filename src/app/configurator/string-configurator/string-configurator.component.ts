import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PCMApi} from "../../PCMApi";

@Component({
  moduleId: module.id,
  selector: 'oc-string-configurator',
  templateUrl: 'string-configurator.component.html',
  styleUrls: ['string-configurator.component.css']
})
export class StringConfiguratorComponent implements OnInit, OnChanges {

  @Input() feature: any;
  @Input() products: any[];

  pcmApi = new PCMApi();
  selectedValues: string[];

  constructor() {}

  ngOnInit() {

  }


  ngOnChanges(changes:{}){

  }

  update(event) {
    this.selectedValues = [];

    let options = event.target.options;
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      if (option.selected) {
        this.selectedValues.push(option.value);
      }
    }

    this.products.forEach((product: {filter : any}) => {
      let cell = this.pcmApi.findCell(product, this.feature);
      let filtered = this.selectedValues.length > 0 && this.selectedValues.indexOf(cell.content) === -1
      this.pcmApi.setFilter(product, this.feature, filtered);
    });
  }

  uniqueValues(feature) : Set<string> {
    let uniqueValues = new Set<string>();
    feature.cells.array.forEach((cell) => uniqueValues.add(cell.content));
    return uniqueValues;
  }

}
