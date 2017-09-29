import { Observable } from 'rxjs';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';
import { getAnalysisDetails } from '../analysisStore';

describe('getAnalysisDetails', () => {
  it('should not touch response if there is are no matching actors and no events', () => {
    const testScheduler = new MusitTestScheduler();

    const post = () =>
      Observable.of({
        response: []
      });

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
          registeredDate: '2017-04-03T10:36:34+00:00',
          subNo: '2',
          term: 'Mansjettknapp',
          type: 'Analysis'
        }
      }
    };

    const load = testScheduler
      .createHotObservable(loadM, {
        1: {
          token: '1234',
          id: 12345,
          collectionId: '00000000-0000-0000-0000-000000000000',
          museumId: 99,
          sampleTypes: {}
        }
      })
      .flatMap(props =>
        getAnalysisDetails(get, post, props)({
          analysis: {
            analysisTypeId: '8453873d-227c-4205-a231-bf7e04164fab',
            eventDate: '2017-03-16T14:37:45+00:00',
            id: 2,
            museumNo: 'MusK58',
            note: 'fdsfsd sdsa 2',
            objectId: 'adea8141-8099-4f67-bff9-ea5090e18335',
            partOf: 1,
            registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
            registeredDate: '2017-04-03T10:36:34+00:00',
            subNo: '2',
            term: 'Mansjettknapp',
            type: 'Analysis'
          }
        })
      );

    testScheduler.expectObservable(load).toBe(expected, expectedStateMap);
    testScheduler.flush();
  });
});
