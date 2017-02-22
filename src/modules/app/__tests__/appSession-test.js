import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { createStore } from 'react-rxjs/dist/RxStore';
import { reducer$, loadAppSession } from '../appSession';
import CollectionId from '../../../models/collectionId';
import MuseumId from '../../../models/museumId';

const diff = require('deep-diff').diff;

describe('appSession', () => {

  it('loadAppSession should return a session', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const setAccessTokenM   = '-1-----------------------';
    const setMuseumIdM      = '--1----------------------';
    const setCollectionIdM  = '---1---------------------';
    const loadAppSessionM   = '----1--------------------';
    const expected          = 'abcde--------------------';

    const expectedStateMap = {
      a: {},
      b: {
        accessToken: '1234'
      },
      c: {
        accessToken: '1234',
        museumId: new MuseumId(88)
      },
      d: {
        accessToken: '1234',
        museumId: new MuseumId(88),
        collectionId: new CollectionId('1234566')
      },
      e: {
        accessToken: '1234',
        museumId: new MuseumId(99),
        collectionId: new CollectionId('2e4f2455-1b3b-4a04-80a1-ba92715ff613'),
        'actor': {
          'fn': 'Per Jaffal Vaffel',
          'email': 'pjv@vaffelmakeriet.no',
          'dataportenId': '00000000-0000-0000-0000-000000000000',
          'dataportenUser': 'pjv@vaffelmakeriet.no'
        },
        'groups': [
          {
            'id': 'bc4b4d44-9470-4622-8e29-03f0bfaf5149',
            'name': 'TestSfAdmin',
            'permission': 30,
            'museumId': 99,
            'description': 'Admin access to storage facility for TEST',
            'collections': [
              {
                'uuid': '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
                'name': 'Arkeologi',
                'oldSchemaNames': [
                  1
                ]
              },
              {
                'uuid': '88b35138-24b5-4e62-bae4-de80fae7df82',
                'name': 'Etnografi',
                'oldSchemaNames': [
                  2
                ]
              }
            ],
            'museumName': 'Test'
          }
        ],
        'buildInfo': {
          'builtAtMillis': '1487761594414',
          'name': 'service_auth',
          'scalaVersion': '2.11.8',
          'buildInfoBuildNumber': '4',
          'version': '0.1-SNAPSHOT',
          'sbtVersion': '0.13.13',
          'builtAtString': '2017-02-22 11:06:34.414'
        }
      }
    };

    // mock up$ and down$ events
    const setAccessToken$ = testScheduler.createHotObservable(setAccessTokenM, {1: '1234'});
    const setMuseumId$ = testScheduler.createHotObservable(setMuseumIdM, {1: new MuseumId(88)});
    const setCollectionId$ = testScheduler.createHotObservable(setCollectionIdM, {1: new CollectionId('1234566')});
    const loadAppSession$ = testScheduler.createHotObservable(loadAppSessionM).switchMap(loadAppSession(
      (url) => {
        if (url.indexOf('buildinfo') > -1) {
          return Observable.of({
            response: {
              'builtAtMillis': '1487761594414',
              'name': 'service_auth',
              'scalaVersion': '2.11.8',
              'buildInfoBuildNumber': '4',
              'version': '0.1-SNAPSHOT',
              'sbtVersion': '0.13.13',
              'builtAtString': '2017-02-22 11:06:34.414'
            }
          });
        }
        if (url.indexOf('museums') > -1) {
          return Observable.of({
            response: [
              {'id': 10000, 'shortName': 'All'},
              {'id': 99, 'shortName': 'Test'},
              {'id': 1, 'shortName': 'Am'},
              {'id': 2, 'shortName': 'Um'},
              {'id': 3, 'shortName': 'Khm'},
              {'id': 4, 'shortName': 'Nhm'},
              {'id': 5, 'shortName': 'Vm'},
              {'id': 6, 'shortName': 'Tmu'},
              {'id': 7, 'shortName': 'Kmn'}
            ]
          });
        }
        if (url.indexOf('currentUser') > -1) {
          return Observable.of({
            response: {
              'fn': 'Per Jaffal Vaffel',
              'email': 'pjv@vaffelmakeriet.no',
              'dataportenId': '00000000-0000-0000-0000-000000000000',
              'dataportenUser': 'pjv@vaffelmakeriet.no'
            }
          });
        }
        if (url.indexOf('groups') > -1) {
          return Observable.of({
            response: [
              {
                'id': 'bc4b4d44-9470-4622-8e29-03f0bfaf5149',
                'name': 'TestSfAdmin',
                'permission': 30,
                'museumId': 99,
                'description': 'Admin access to storage facility for TEST',
                'collections': [
                  {'uuid': '2e4f2455-1b3b-4a04-80a1-ba92715ff613', 'name': 'Arkeologi', 'oldSchemaNames': [1]},
                  {'uuid': '88b35138-24b5-4e62-bae4-de80fae7df82', 'name': 'Etnografi', 'oldSchemaNames': [2]}
                ]
              }
            ]
          });
        }
        return Observable.of({
          response: null
        });
      },
      '1234'
    ));

    const state$ = reducer$({
      setAccessToken$,
      loadAppSession$,
      setCollectionId$,
      setMuseumId$
    });

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});