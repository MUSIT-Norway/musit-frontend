import Event from '../event';
import { Observable } from 'rxjs';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

describe('Event model', () => {
  it('should work', () => {
    const testScheduler = new MusitTestScheduler();
    const get = url => {
      if (url.indexOf('analyses') > -1) {
        return Observable.of({
          response: [
            {
              id: 1,
              type: 'Analysis',
              eventDate: '2017-03-23T11:47:03+00:00',
              registeredBy: '1234',
              note: 'note'
            },
            {
              id: 2,
              type: 'Analysis',
              eventDate: '2017-03-23T11:47:03+00:00',
              registeredBy: '1234',
              note: 'note'
            },
            {
              id: 3,
              type: 'Analysis',
              eventDate: '2017-03-23T11:47:03+00:00',
              registeredBy: '1234',
              note: 'note',
              doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
            },
            {
              doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
              doneDate: '2017-05-30T12:09:34+00:00',
              id: 'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
              objectType: 'collection',
              registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
              registeredDate: '2017-05-30T12:09:34+00:00'
            }
          ]
        });
      }
      return Observable.of({
        response: [
          {
            registeredBy: '1234',
            registeredDate: '2017-03-23T11:47:03+00:00',
            doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
            from: {},
            to: {}
          }
        ]
      });
    };

    const post = () => {
      return Observable.of({
        response: [
          {
            dataportenId: '1234',
            fn: 'Some name'
          },
          {
            dataportenId: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
            fn: 'Rituvesh Kumar'
          }
        ]
      });
    };

    const fn = Event.getAnalysesAndMoves(get, post);

    const props = {
      token: '1234',
      id: '12345',
      objectId: 1,
      museumId: 99
    };

    const loadM = '-1----------';
    const expected = '-a----------';

    const expectedStateMap = {
      a: [
        {
          id: 1,
          type: 'Analysis',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          note: 'note',
          doneBy: 'Ukjent',
          doneDate: 'Ukjent',
          registeredDate: 'Ukjent'
        },
        {
          id: 2,
          type: 'Analysis',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          note: 'note',
          doneBy: 'Ukjent',
          doneDate: 'Ukjent',
          registeredDate: 'Ukjent'
        },
        {
          id: 3,
          type: 'Analysis',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          note: 'note',
          doneBy: 'Rituvesh Kumar',
          doneDate: 'Ukjent',
          registeredDate: 'Ukjent'
        },
        {
          doneBy: 'Rituvesh Kumar',
          doneDate: '30.05.2017',
          eventDate: '30.05.2017',
          id: 'aba6a67c-f742-4a44-b13e-0415ec1abb2a',
          objectType: 'collection',
          registeredBy: 'Rituvesh Kumar',
          registeredDate: '30.05.2017'
        },
        {
          registeredDate: '23.03.2017',
          from: {
            breadcrumb: []
          },
          to: {
            breadcrumb: []
          },
          type: 'MoveObject',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          doneBy: 'Rituvesh Kumar',
          doneDate: 'Ukjent'
        }
      ]
    };

    const load = testScheduler.createHotObservable(loadM);

    testScheduler
      .expectObservable(load.flatMap(() => fn(props)))
      .toBe(expected, expectedStateMap);
    testScheduler.flush();
  });
});
