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
import { IntegerConfiguratorComponent } from './integer-configurator.component';

describe('Component: IntegerConfigurator', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [IntegerConfiguratorComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([IntegerConfiguratorComponent],
      (component: IntegerConfiguratorComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(IntegerConfiguratorComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(IntegerConfiguratorComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-integer-configurator></app-integer-configurator>
  `,
  directives: [IntegerConfiguratorComponent]
})
class IntegerConfiguratorComponentTestController {
}

