import Analysis from '../analysis';
import MuseumId from '../museumId';
import CollectionId from '../collectionId';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/Rx';
const diff = require('deep-diff').diff;
import assert from 'assert';

describe('Analysis model', () => {
  it('should work', () => {
    const get = url => {
      if (url.indexOf('analyses') > -1) {
        return Observable.of({
          response: {
            analysis: {
              analysisTypeId: '8453873d-227c-4205-a231-bf7e04164fab',
              eventDate: '2017-03-16T14:37:45+00:00',
              id: 2,
              museumNo: 'MusK58',
              note: 'fdsfsd sdsa 2',
              objectId: 'adea8141-8099-4f67-bff9-ea5090e18335',
              partOf: 1,
              registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
              registeredByName: 'Rituvesh Kumar',
              registeredDate: '2017-04-03T10:36:34+00:00',
              subNo: '2',
              term: 'Mansjettknapp',
              type: 'Analysis'
            }
          }
        });
      }
      return Observable.of({
        response: []
      });
    };

    const fn = Analysis.getAnalysisWithDeatils(get);

    const props = {
      token: '1234',
      id: '12345',
      collectionId: new CollectionId('00000000-0000-0000-0000-000000000000'),
      museumId: new MuseumId(99)
    };

    const testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual, null, 2));
      // console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    const loadM = '-1----------';
    const expected = '-a----------';

    const expectedStateMap = {
      a: {
        analysis: {
          analysisTypeId: '8453873d-227c-4205-a231-bf7e04164fab',
          eventDate: '2017-03-16T14:37:45+00:00',
          id: 2,
          museumNo: 'MusK58',
          note: 'fdsfsd sdsa 2',
          objectId: 'adea8141-8099-4f67-bff9-ea5090e18335',
          partOf: 1,
          registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredByName: 'Rituvesh Kumar',
          registeredDate: '2017-04-03T10:36:34+00:00',
          subNo: '2',
          term: 'Mansjettknapp',
          type: 'Analysis'
        }
      }
    };

    const load = testScheduler.createHotObservable(loadM);

    testScheduler
      .expectObservable(load.flatMap(() => fn(props)))
      .toBe(expected, expectedStateMap);
    testScheduler.flush();
  });
});
