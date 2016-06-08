import {Component, OnInit, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'oc-configurator',
  templateUrl: 'configurator.component.html',
  styleUrls: ['configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  @Input() pcmContainer : any;

  constructor() {}

  ngOnInit() {
  }

}
