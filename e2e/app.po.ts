export class ChartPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('chart-app h1')).getText();
  }
}
