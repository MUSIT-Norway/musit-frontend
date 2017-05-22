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
              note: 'note'
            }
          ]
        });
      }
      return Observable.of({
        response: [
          {
            registeredBy: '1234',
            registeredDate: '2017-03-23T11:47:03+00:00',
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
          note: 'note'
        },
        {
          id: 2,
          type: 'Analysis',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          note: 'note'
        },
        {
          id: 3,
          type: 'Analysis',
          eventDate: '23.03.2017',
          registeredBy: 'Some name',
          note: 'note'
        },
        {
          registeredDate: '2017-03-23T11:47:03+00:00',
          from: {
            breadcrumb: []
          },
          to: {
            breadcrumb: []
          },
          type: 'MoveObject',
          eventDate: '23.03.2017',
          registeredBy: 'Some name'
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
