import {Component, OnInit, Input} from "@angular/core";
import {PCMApi} from "../../PCMApi";

@Component({
  moduleId: module.id,
  selector: 'oc-boolean-configurator',
  templateUrl: 'boolean-configurator.component.html',
  styleUrls: ['boolean-configurator.component.css']
})
export class BooleanConfiguratorComponent implements OnInit {

  @Input() products : any[];
  @Input() feature : any;

  pcmApi = new PCMApi();

  state: State = State.Indeterminate;
  checked: boolean = false;
  indeterminate: boolean = true;

  constructor() {}

  ngOnInit() {

  }


  update() {
    switch (this.state) {
      case State.Indeterminate: // Indeterminate -> Selected
        this.state = State.Selected;
        this.checked = true;
        this.indeterminate = false;
        break;
      case State.Selected: // Selected -> NotSelected
        this.state = State.NotSelected;
        this.checked = false;
        this.indeterminate = false;
        break;
      case State.NotSelected: // NotSelected -> Indeterminate
        this.state = State.Indeterminate;
        this.checked = false;
        this.indeterminate = true;
        break;
    }

    this.products.forEach((product: {filtered : boolean}) => {
      let cell = this.pcmApi.findCell(product, this.feature);
      product.filtered = !this.indeterminate && cell.interpretation.value === this.checked;
    });
  }
}

enum State {
  Selected,
  NotSelected,
  Indeterminate
}
