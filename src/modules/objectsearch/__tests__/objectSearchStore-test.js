import {TestScheduler, Subject, Observable} from 'rxjs/Rx';
import assert from 'assert';
import {store$, initialState, searchForObjects} from '../objectSearchStore';
import MusemId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';

describe('objectSearchStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      return assert.deepEqual(actual, expected);
    });

    // mock streams
    const searchForObjectsdM = '--x-------------';
    const onChangeFieldM = '-x--------------';
    const expected = 'abc-------------';

    const expectedStateMap = {
      a: initialState,
      b: {
        ...initialState,
        params: {
          ...initialState.params,
          test: 'hallo'
        }
      },
      c: {
        loaded: true,
        loading: false,
        data: {
          'totalMatches': 31,
          'matches': [{
            'id': 14,
            'museumId': 99,
            'museumNo': 'MusK23',
            'term': 'Lite skaft av ben',
            'currentLocationId': 7,
            'path': ',1,3,4,7,',
            'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}, {
              'nodeId': 3,
              'name': 'Utviklingsmuseet Org'
            }, {'nodeId': 4, 'name': 'Forskningens hus'}, {'nodeId': 7, 'name': 'Forskningsværelset'}],
            'breadcrumb': [{'id': 1, 'name': 'Utviklingsmuseet', 'url': '/magasin/1'}, {
              'id': 3,
              'name': 'Utviklingsmuseet Org',
              'url': '/magasin/3'
            }, {'id': 4, 'name': 'Forskningens hus', 'url': '/magasin/4'}, {
              'id': 7,
              'name': 'Forskningsværelset',
              'url': '/magasin/7'
            }]
          }, {
            'id': 15,
            'museumId': 99,
            'museumNo': 'MusK24',
            'subNo': 'a',
            'term': 'Lendeklede',
            'currentLocationId': 7,
            'path': ',1,3,4,7,',
            'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}, {
              'nodeId': 3,
              'name': 'Utviklingsmuseet Org'
            }, {'nodeId': 4, 'name': 'Forskningens hus'}, {'nodeId': 7, 'name': 'Forskningsværelset'}],
            'breadcrumb': [{'id': 1, 'name': 'Utviklingsmuseet', 'url': '/magasin/1'}, {
              'id': 3,
              'name': 'Utviklingsmuseet Org',
              'url': '/magasin/3'
            }, {'id': 4, 'name': 'Forskningens hus', 'url': '/magasin/4'}, {
              'id': 7,
              'name': 'Forskningsværelset',
              'url': '/magasin/7'
            }]
          }, {
            'id': 16,
            'museumId': 99,
            'museumNo': 'MusK24',
            'subNo': 'b',
            'term': 'Kokekar',
            'currentLocationId': 1,
            'path': ',1,',
            'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}],
            'breadcrumb': [{'id': 1, 'name': 'Utviklingsmuseet', 'url': '/magasin/1'}]
          }, {
            'id': 20,
            'museumId': 99,
            'museumNo': 'MusK33',
            'term': 'Bronsjespenne',
            'currentLocationId': 1,
            'path': ',1,',
            'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}],
            'breadcrumb': [{'id': 1, 'name': 'Utviklingsmuseet', 'url': '/magasin/1'}]
          }, {
            'id': 21,
            'museumId': 99,
            'museumNo': 'MusK34',
            'subNo': 'a',
            'term': 'Kniv',
            'currentLocationId': 1,
            'path': ',1,',
            'pathNames': [{'nodeId': 1, 'name': 'Utviklingsmuseet'}],
            'breadcrumb': [{'id': 1, 'name': 'Utviklingsmuseet', 'url': '/magasin/1'}]
          }]
        },
        params: {
          ...initialState.params,
          test: 'hallo'
        }
      }
    };

    // mock up$ and down$ events
    const clearSearch$ = new Subject();
    const searchForObjects$ = testScheduler.createHotObservable(searchForObjectsdM,
      {x: {params: {}, token: '12344', museumId: new MusemId(1), collectionId: new CollectionId('12345')}}
    ).switchMap(searchForObjects(
      () => {
        return Observable.of({
          response: {
            'totalMatches': 31,
            'matches': [
              {
                'id': 14,
                'museumId': 99,
                'museumNo': 'MusK23',
                'term': 'Lite skaft av ben',
                'currentLocationId': 7,
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
                ]
              },
              {
                'id': 15,
                'museumId': 99,
                'museumNo': 'MusK24',
                'subNo': 'a',
                'term': 'Lendeklede',
                'currentLocationId': 7,
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
                ]
              },
              {
                'id': 16,
                'museumId': 99,
                'museumNo': 'MusK24',
                'subNo': 'b',
                'term': 'Kokekar',
                'currentLocationId': 1,
                'path': ',1,',
                'pathNames': [
                  {
                    'nodeId': 1,
                    'name': 'Utviklingsmuseet'
                  }
                ]
              },
              {
                'id': 20,
                'museumId': 99,
                'museumNo': 'MusK33',
                'term': 'Bronsjespenne',
                'currentLocationId': 1,
                'path': ',1,',
                'pathNames': [
                  {
                    'nodeId': 1,
                    'name': 'Utviklingsmuseet'
                  }
                ]
              },
              {
                'id': 21,
                'museumId': 99,
                'museumNo': 'MusK34',
                'subNo': 'a',
                'term': 'Kniv',
                'currentLocationId': 1,
                'path': ',1,',
                'pathNames': [
                  {
                    'nodeId': 1,
                    'name': 'Utviklingsmuseet'
                  }
                ]
              }
            ]
          }
        });
      }
    ));
    const onChangeField$ = testScheduler.createHotObservable(onChangeFieldM, {x: {field: 'test', value: 'hallo'}});

    const state$ = store$({clearSearch$, searchForObjects$, onChangeField$});

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});