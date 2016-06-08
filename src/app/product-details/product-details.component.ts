import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PCMApi} from "../PCMApi";

@Component({
  moduleId: module.id,
  selector: 'oc-product-details',
  templateUrl: 'product-details.component.html',
  styleUrls: ['product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  pcmApi = new PCMApi();

  @Input() pcmContainer : any;
  @Input() product : any;

  constructor() {}

  ngOnInit() {

  }

}
