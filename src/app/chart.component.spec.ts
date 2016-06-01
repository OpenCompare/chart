import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { ChartAppComponent } from '../app/chart.component';

beforeEachProviders(() => [ChartAppComponent]);

describe('App: Chart', () => {
  it('should create the app',
      inject([ChartAppComponent], (app: ChartAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'chart works!\'',
      inject([ChartAppComponent], (app: ChartAppComponent) => {
    expect(app.title).toEqual('chart works!');
  }));
});
