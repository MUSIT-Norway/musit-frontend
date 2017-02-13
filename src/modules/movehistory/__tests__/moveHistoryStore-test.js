import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, initialState } from '../moveHistoryStore';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
import MusitObject from '../../../models/object';

const diff = require('deep-diff').diff;

describe('moveHistory', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const clearM            = '---1-------';
    const loadMoveHistoryM  = '-12--------';
    const expected          = 'aaba-------';

    const expectedStateMap = {
      a: initialState,
      b: {
        data: [
          {
            'registeredBy': 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
            'registeredDate': '2017-02-13T14:34:51+00:00',
            'doneBy': 'Ukjent',
            'doneDate': '2017-02-13T14:34:51+00:00',
            'from': {
              'path': ',1,',
              'pathNames': [
                {
                  'nodeId': 1,
                  'name': 'Utviklingsmuseet'
                }
              ],
              'breadcrumb': [
                {
                  'id': 1,
                  'name': 'Utviklingsmuseet',
                  'url': '/magasin/1'
                }
              ]
            },
            'to': {
              'path': ',1,3,4,7,',
              'pathNames': [
                {
                  'nodeId': 1,
                  'name': 'Utviklingsmuseet'
                },
                {
                  'nodeId': 3,
                  'name': 'Utviklingsmuseet Org'
                },
                {
                  'nodeId': 4,
                  'name': 'Forskningens hus'
                },
                {
                  'nodeId': 7,
                  'name': 'Forskningsværelset'
                }
              ],
              'breadcrumb': [
                {
                  'id': 1,
                  'name': 'Utviklingsmuseet',
                  'url': '/magasin/1'
                },
                {
                  'id': 3,
                  'name': 'Utviklingsmuseet Org',
                  'url': '/magasin/3'
                },
                {
                  'id': 4,
                  'name': 'Forskningens hus',
                  'url': '/magasin/4'
                },
                {
                  'id': 7,
                  'name': 'Forskningsværelset',
                  'url': '/magasin/7'
                }
              ]
            }
          }
        ]
      }
    };

    // mock up$ and down$ events
    const clear$ = testScheduler.createHotObservable(clearM);
    const loadMoveHistory$ = testScheduler.createHotObservable(loadMoveHistoryM, {
      1: { objectId: 1234, museumId: new MuseumId(99), token: '1234' },
      2: { objectId: 4566, museumId: new MuseumId(2), token: '1234' }
    })
      .switchMap(MusitObject.getLocationHistory(
        (url) => {
          if (url.indexOf('objects/1234/locations') > -1) {
            return Observable.of({
              response: []
            });
          }
          if (url.indexOf('objects/4566/locations') > -1) {
            return Observable.of({
              response: [{
                'registeredBy': 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                'registeredDate': '2017-02-13T14:34:51+00:00',
                'doneBy': 'Jarl',
                'doneDate': '2017-02-13T14:34:51+00:00',
                'from': {'path': ',1,', 'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}]},
                'to': {
                  'path': ',1,3,4,7,',
                  'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}, {
                    'nodeId': 3,
                    'name': 'Utviklingsmuseet Org'
                  }, {'nodeId': 4, 'name': 'Forskningens hus'}, {'nodeId': 7, 'name': 'Forskningsværelset'}]
                }
              }]
            });
          }
        },
        (url, data) => {
          if (data.find(d => d === 'f7144d5d-732f-487c-b2ef-e895ab5cf163')) {
            return Observable.of({
              response: [
                {
                  dataportenId: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                  fn: 'Jarl'
                }
              ]
            });
          }
          return Observable.of({
            response: []
          });
        }
      ));

    const state$ = reducer$({clear$, loadMoveHistory$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$, Observable.of(initialState))).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});