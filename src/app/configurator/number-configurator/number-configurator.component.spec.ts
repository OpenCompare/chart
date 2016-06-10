import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NumberConfiguratorComponent } from './number-configurator.component';

describe('Component: NumberConfigurator', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [NumberConfiguratorComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([NumberConfiguratorComponent],
      (component: NumberConfiguratorComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(NumberConfiguratorComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(NumberConfiguratorComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-number-configurator></app-number-configurator>
  `,
  directives: [NumberConfiguratorComponent]
})
class NumberConfiguratorComponentTestController {
}

