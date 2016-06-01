"use strict";
var testing_1 = require('@angular/core/testing');
var chart_component_1 = require('../app/chart.component');
testing_1.beforeEachProviders(function () { return [chart_component_1.ChartAppComponent]; });
testing_1.describe('App: Chart', function () {
    testing_1.it('should create the app', testing_1.inject([chart_component_1.ChartAppComponent], function (app) {
        testing_1.expect(app).toBeTruthy();
    }));
    testing_1.it('should have as title \'chart works!\'', testing_1.inject([chart_component_1.ChartAppComponent], function (app) {
        testing_1.expect(app.title).toEqual('chart works!');
    }));
});
//# sourceMappingURL=chart.component.spec.js.map