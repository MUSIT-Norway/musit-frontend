import { jsdom } from 'jsdom'

before(() => {
  console.log('global setup');
  global.document = jsdom('<!doctype html><html><body></body></html>')
  global.window = document.defaultView
  global.navigator = global.window.navigator
});

after(() => {
  console.log('global teardown');
});
