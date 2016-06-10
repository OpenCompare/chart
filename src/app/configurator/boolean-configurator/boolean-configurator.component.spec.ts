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
import { BooleanConfiguratorComponent } from './boolean-configurator.component';

describe('Component: BooleanConfigurator', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [BooleanConfiguratorComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([BooleanConfiguratorComponent],
      (component: BooleanConfiguratorComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(BooleanConfiguratorComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(BooleanConfiguratorComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-boolean-configurator></app-boolean-configurator>
  `,
  directives: [BooleanConfiguratorComponent]
})
class BooleanConfiguratorComponentTestController {
}

