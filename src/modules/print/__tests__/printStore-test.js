import { Observable } from 'rxjs/Rx';
import { store$ } from '../printStore';
import Template from '../../../models/template';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('printStore', () => {
  /*eslint-disable */
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    const setTemplateIdM = '--------------';
    const setLevelM = '--------------';
    const clearAllM = '----1---------';
    const clearRenderedM = '---1----------';
    const loadTemplatesM = '-1------------';
    const renderTemplateM = '--1-----------';
    const expected = 'abcde---------';

    const expectedStateMap = {
      a: {
        templates: [],
        rendered: null,
        level: 0
      },
      b: {
        rendered: null,
        level: 0,
        templates: [
          {
            id: 1,
            name: 'Label-1 70mm x 37mm',
            labelWidth: 70,
            labelHeight: 37,
            colsPerPage: 3,
            rowsPerPage: 8
          },
          {
            id: 2,
            name: 'Label-2 105mm x 74mm',
            labelWidth: 105,
            labelHeight: 74,
            colsPerPage: 2,
            rowsPerPage: 4
          }
        ]
      },
      c: {
        level: 0,
        templates: [
          {
            id: 1,
            name: 'Label-1 70mm x 37mm',
            labelWidth: 70,
            labelHeight: 37,
            colsPerPage: 3,
            rowsPerPage: 8
          },
          {
            id: 2,
            name: 'Label-2 105mm x 74mm',
            labelWidth: 105,
            labelHeight: 74,
            colsPerPage: 2,
            rowsPerPage: 4
          }
        ],
        rendered:
          '<!DOCTYPE html> <html lang="en"> <head> <link rel="stylesheet" href="/service_barcode/assets/css/portrait.css"> <link rel="stylesheet" href="/service_barcode/assets/css/label1.css"> </head> <body> <div class="labelsContainer"> <div class="label"> <div class="top"> <div class="codeImage"> <img width="90px" height="90px" src="/service_barcode/barcode/d3982b48-56c7-4d27-bc81-6e38b59d57ed?codeFormat=1" /> </div> <div class="name">Utviklingsmuseet Org</div> </div> <div class="uuid">d3982b48-56c7-4d27-bc81-6e38b59d57ed</div> </div> </div> </body> </html>'
      },
      d: {
        level: 0,
        templates: [
          {
            id: 1,
            name: 'Label-1 70mm x 37mm',
            labelWidth: 70,
            labelHeight: 37,
            colsPerPage: 3,
            rowsPerPage: 8
          },
          {
            id: 2,
            name: 'Label-2 105mm x 74mm',
            labelWidth: 105,
            labelHeight: 74,
            colsPerPage: 2,
            rowsPerPage: 4
          }
        ],
        rendered: null
      },
      e: { templates: [], rendered: null, level: 0 }
    };

    // mock up$ and down$ events
    const clearAll$ = testScheduler.createHotObservable(clearAllM);
    const setLevel$ = testScheduler.createHotObservable(setLevelM);
    const setTemplateId$ = testScheduler.createHotObservable(setTemplateIdM);
    const clearRendered$ = testScheduler.createHotObservable(clearRenderedM);
    const loadTemplates$ = testScheduler
      .createHotObservable(loadTemplatesM, { 1: { token: '1234' } })
      .switchMap(
        Template.loadTemplates(() =>
          Observable.of({
            response: [
              {
                id: 1,
                name: 'Label-1 70mm x 37mm',
                labelWidth: 70,
                labelHeight: 37,
                colsPerPage: 3,
                rowsPerPage: 8
              },
              {
                id: 2,
                name: 'Label-2 105mm x 74mm',
                labelWidth: 105,
                labelHeight: 74,
                colsPerPage: 2,
                rowsPerPage: 4
              }
            ]
          })
        )
      );
    const renderTemplate$ = testScheduler
      .createHotObservable(renderTemplateM, {
        1: {
          token: '1234',
          templateId: 1,
          codeFormat: 1,
          nodes: [{ nodeId: 1, name: 'Test 1' }, { nodeId: 2, name: 'Test 2' }]
        }
      })
      .switchMap(
        Template.renderTemplate(() =>
          Observable.of({
            response:
              '<!DOCTYPE html> <html lang="en"> <head> <link rel="stylesheet" href="/service_barcode/assets/css/portrait.css"> <link rel="stylesheet" href="/service_barcode/assets/css/label1.css"> </head> <body> <div class="labelsContainer"> <div class="label"> <div class="top"> <div class="codeImage"> <img width="90px" height="90px" src="/service_barcode/barcode/d3982b48-56c7-4d27-bc81-6e38b59d57ed?codeFormat=1" /> </div> <div class="name">Utviklingsmuseet Org</div> </div> <div class="uuid">d3982b48-56c7-4d27-bc81-6e38b59d57ed</div> </div> </div> </body> </html>'
          })
        )
      );

    const state$ = store$({
      clearAll$,
      clearRendered$,
      loadTemplates$,
      renderTemplate$,
      setLevel$,
      setTemplateId$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
