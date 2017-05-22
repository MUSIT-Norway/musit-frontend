import { Observable, Subject } from 'rxjs/Rx';
import { initialState, store$ } from '../controlStore';
import Control from '../../../models/control';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('ControlStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const getControlM = '-x-------------';
    const expected = 'ab-------------';

    const expectedStateMap = {
      a: initialState,
      b: {
        data: {
          id: 51,
          doneBy: 'Kumar',
          doneDate: '2017-02-09T09:52:11+00:00',
          affectedThing: 3,
          registeredBy: 'Kumar',
          registeredDate: '2017-02-09T09:52:26+00:00',
          eventType: 'Control',
          alcohol: {
            ok: true
          },
          cleaning: {
            ok: true
          },
          gas: {
            ok: true
          },
          hypoxicAir: {
            ok: true
          },
          lightingCondition: {
            ok: true
          },
          mold: {
            ok: true
          },
          pest: {
            ok: true
          },
          relativeHumidity: {
            ok: true
          },
          temperature: {
            ok: true
          }
        }
      }
    };

    // mock up$ and down$ events
    const getControl$ = testScheduler
      .createHotObservable(getControlM, {
        x: { token: '12344', museumId: 1, nodeId: 1, controlId: 2 }
      })
      .switchMap(
        Control.getControl(
          () => {
            return Observable.of({
              response: {
                id: 51,
                doneBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
                doneDate: '2017-02-09T09:52:11+00:00',
                affectedThing: 3,
                registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
                registeredDate: '2017-02-09T09:52:26+00:00',
                eventType: 'Control',
                alcohol: {
                  ok: true
                },
                cleaning: {
                  ok: true
                },
                gas: {
                  ok: true
                },
                hypoxicAir: {
                  ok: true
                },
                lightingCondition: {
                  ok: true
                },
                mold: {
                  ok: true
                },
                pest: {
                  ok: true
                },
                relativeHumidity: {
                  ok: true
                },
                temperature: {
                  ok: true
                }
              }
            });
          },
          () => {
            return Observable.of({
              response: [
                {
                  dataportenId: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
                  fn: 'Kumar'
                }
              ]
            });
          }
        )
      );

    const state$ = store$({
      clear$: new Subject(),
      loadRootNode$: new Subject(),
      getControl$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
