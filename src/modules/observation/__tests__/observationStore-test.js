import { Observable } from 'rxjs/Rx';
import { store$, initialState } from '../observationStore';
import MusitNode from '../../../models/node';
import Observation from '../../../models/observation';
import MusitTestScheduler from 'testutils/MusitTestScheduler';

describe('printStore', () => {
  /*eslint-disable */
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const setLoadingM = '-1------------';
    const getObservationM = '--1-----------';
    const loadRootNodeM = '---1----------';
    const expected = 'abcd----------';

    const expectedStateMap = {
      a: initialState,
      b: {
        data: {},
        rootNode: null,
        loading: true
      },
      c: {
        data: {
          doneBy: 'Jarl',
          doneDate: '2017-02-08T09:00:50+00:00',
          registeredBy: 'Jarl',
          registeredDate: '2017-02-08T09:01:07+00:00',
          observations: [
            {
              type: 'gas',
              data: {
                leftValue: 'pppppppppppppppp',
                rightValue: undefined
              }
            },
            {
              type: 'pest',
              data: {
                identificationValue: 'kkk',
                observations: [
                  {
                    lifeCycle: 'puppe',
                    count: '6'
                  }
                ]
              }
            }
          ]
        },
        rootNode: null,
        loading: false
      },
      d: {
        data: {
          doneBy: 'Jarl',
          doneDate: '2017-02-08T09:00:50+00:00',
          registeredBy: 'Jarl',
          registeredDate: '2017-02-08T09:01:07+00:00',
          observations: [
            {
              type: 'gas',
              data: {
                leftValue: 'pppppppppppppppp',
                rightValue: undefined
              }
            },
            {
              type: 'pest',
              data: {
                identificationValue: 'kkk',
                observations: [
                  {
                    lifeCycle: 'puppe',
                    count: '6'
                  }
                ]
              }
            }
          ]
        },
        rootNode: {
          id: 3,
          nodeId: 'd3982b48-56c7-4d27-bc81-6e38b59d57ed',
          name: 'Utviklingsmuseet Org',
          isPartOf: 1,
          path: ',1,3,',
          pathNames: [
            {
              nodeId: 1,
              nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
              name: 'Utviklingsmuseet'
            },
            {
              nodeId: 3,
              nodeUuid: '403cebde-082c-4002-8f78-16ad178a054a',
              name: 'Utviklingsmuseet Org'
            }
          ],
          updatedBy: 'd63ab290-2fab-42d2-9b57-2475dfbd0b3c',
          updatedDate: '2015-12-31T23:00:00+00:00',
          type: 'Organisation',
          breadcrumb: [
            {
              id: '0615c304-e7ec-46ad-aebc-399884181eaf',
              nodeId: '0615c304-e7ec-46ad-aebc-399884181eaf',
              name: 'Utviklingsmuseet',
              url: '/magasin/0615c304-e7ec-46ad-aebc-399884181eaf'
            },
            {
              id: '403cebde-082c-4002-8f78-16ad178a054a',
              nodeId: '403cebde-082c-4002-8f78-16ad178a054a',
              name: 'Utviklingsmuseet Org',
              url: '/magasin/403cebde-082c-4002-8f78-16ad178a054a'
            }
          ],
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loading: false
      }
    };

    // mock up$ and down$ events
    const loadRootNode$ = testScheduler
      .createHotObservable(loadRootNodeM, {
        1: {
          nodeId: 3,
          museumId: 99,
          token: '1234'
        }
      })
      .switchMap(
        MusitNode.getNode(() =>
          Observable.of({
            response: {
              id: 3,
              nodeId: 'd3982b48-56c7-4d27-bc81-6e38b59d57ed',
              name: 'Utviklingsmuseet Org',
              isPartOf: 1,
              path: ',1,3,',
              pathNames: [
                {
                  nodeId: 1,
                  nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  name: 'Utviklingsmuseet'
                },
                {
                  nodeId: 3,
                  nodeUuid: '403cebde-082c-4002-8f78-16ad178a054a',
                  name: 'Utviklingsmuseet Org'
                }
              ],
              updatedBy: 'd63ab290-2fab-42d2-9b57-2475dfbd0b3c',
              updatedDate: '2015-12-31T23:00:00+00:00',
              type: 'Organisation'
            }
          }))
      );
    const setLoading$ = testScheduler.createHotObservable(setLoadingM);
    const getObservation$ = testScheduler
      .createHotObservable(getObservationM, {
        1: {
          nodeId: 3,
          observationId: 41,
          museumId: 99,
          token: '1234'
        }
      })
      .switchMap(
        Observation.getObservation(
          () =>
            Observable.of({
              response: {
                id: 41,
                doneBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                doneDate: '2017-02-08T09:00:50+00:00',
                affectedThing: 3,
                registeredBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                registeredDate: '2017-02-08T09:01:07+00:00',
                eventType: 'Observation',
                gas: { gas: 'pppppppppppppppp' },
                pest: {
                  identification: 'kkk',
                  lifecycles: [{ stage: 'puppe', quantity: 6 }]
                }
              }
            }),
          () =>
            Observable.of({
              response: [
                {
                  dataportenId: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                  fn: 'Jarl'
                }
              ]
            })
        )
      );

    const state$ = store$({ loadRootNode$, setLoading$, getObservation$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
