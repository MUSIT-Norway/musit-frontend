import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, loadTemplates, renderTemplate } from '../printStore';
import { createStore } from 'react-rxjs/dist/RxStore';

describe('printStore', () => {
  /*eslint-disable */
  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      //console.log(JSON.stringify(actual, null, 2));
      //console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const clearAllM         = '----1---------';
    const clearRenderedM    = '---1----------';
    const loadTemplatesM    = '-1------------';
    const renderTemplateM   = '--1-----------';
    const expected          = 'abcde---------';

    const expectedStateMap = {
      a: {},
      b: {
        templates: [{
          'id': 1,
          'name': 'Label-1 70mm x 37mm',
          'labelWidth': 70,
          'labelHeight': 37,
          'colsPerPage': 3,
          'rowsPerPage': 8
        }, {
          'id': 2,
          'name': 'Label-2 105mm x 74mm',
          'labelWidth': 105,
          'labelHeight': 74,
          'colsPerPage': 2,
          'rowsPerPage': 4
        }]
      },
      c: {
        templates: [{
          'id': 1,
          'name': 'Label-1 70mm x 37mm',
          'labelWidth': 70,
          'labelHeight': 37,
          'colsPerPage': 3,
          'rowsPerPage': 8
        }, {
          'id': 2,
          'name': 'Label-2 105mm x 74mm',
          'labelWidth': 105,
          'labelHeight': 74,
          'colsPerPage': 2,
          'rowsPerPage': 4
        }],
        rendered: '<!DOCTYPE html> <html lang="en"> <head> <link rel="stylesheet" href="/service_barcode/assets/css/portrait.css"> <link rel="stylesheet" href="/service_barcode/assets/css/label1.css"> </head> <body> <div class="labelsContainer"> <div class="label"> <div class="top"> <div class="codeImage"> <img width="90px" height="90px" src="/service_barcode/barcode/d3982b48-56c7-4d27-bc81-6e38b59d57ed?codeFormat=1" /> </div> <div class="name">Utviklingsmuseet Org</div> </div> <div class="uuid">d3982b48-56c7-4d27-bc81-6e38b59d57ed</div> </div> </div> </body> </html>'
      },
      d: {
        templates: [{
          'id': 1,
          'name': 'Label-1 70mm x 37mm',
          'labelWidth': 70,
          'labelHeight': 37,
          'colsPerPage': 3,
          'rowsPerPage': 8
        }, {
          'id': 2,
          'name': 'Label-2 105mm x 74mm',
          'labelWidth': 105,
          'labelHeight': 74,
          'colsPerPage': 2,
          'rowsPerPage': 4
        }],
        rendered: null
      },
      e: { templates: [], rendered: null }
    };

    // mock up$ and down$ events
    const clearAll$ = testScheduler.createHotObservable(clearAllM);
    const clearRendered$ = testScheduler.createHotObservable(clearRenderedM);
    const loadTemplates$ = testScheduler.createHotObservable(loadTemplatesM, { 1: { token: '1234' }})
        .switchMap(loadTemplates({
          simpleGet: () => Observable.of({
            response: [{
              'id': 1,
              'name': 'Label-1 70mm x 37mm',
              'labelWidth': 70,
              'labelHeight': 37,
              'colsPerPage': 3,
              'rowsPerPage': 8
            }, {
              'id': 2,
              'name': 'Label-2 105mm x 74mm',
              'labelWidth': 105,
              'labelHeight': 74,
              'colsPerPage': 2,
              'rowsPerPage': 4
            }]
          })
        }));
    const renderTemplate$ = testScheduler.createHotObservable(renderTemplateM, { 1: { token: '1234', templateId: 1, codeFormat: 1, nodes: [
        { nodeId: 1, name: 'Test 1' },
        { nodeId: 2, name: 'Test 2' }
    ]}}).switchMap(renderTemplate({
      ajax: () => Observable.of({
        response: '<!DOCTYPE html> <html lang="en"> <head> <link rel="stylesheet" href="/service_barcode/assets/css/portrait.css"> <link rel="stylesheet" href="/service_barcode/assets/css/label1.css"> </head> <body> <div class="labelsContainer"> <div class="label"> <div class="top"> <div class="codeImage"> <img width="90px" height="90px" src="/service_barcode/barcode/d3982b48-56c7-4d27-bc81-6e38b59d57ed?codeFormat=1" /> </div> <div class="name">Utviklingsmuseet Org</div> </div> <div class="uuid">d3982b48-56c7-4d27-bc81-6e38b59d57ed</div> </div> </div> </body> </html>'
      })
    }));

    const state$ = reducer$({clearAll$, clearRendered$, loadTemplates$, renderTemplate$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});