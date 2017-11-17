import { Observable } from 'rxjs';
import { store$, initialState, getLocationHistory } from '../moveHistoryStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('moveHistory', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const clearM = '---1-------';
    const loadMoveHistoryM = '-12-3------';
    const expected = 'aabac------';

    const expectedStateMap = {
      a: initialState,
      b: {
        data: [
          {
            registeredBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
            registeredDate: '2017-02-13T14:34:51+00:00',
            doneBy: 'Jarl',
            doneDate: '2017-02-13T14:34:51+00:00',
            from: {
              path: ',1,',
              pathNames: [
                {
                  nodeId: 1,
                  nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  name: 'Utviklingsmuseet'
                }
              ],
              breadcrumb: [
                {
                  id: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  nodeId: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  name: 'Utviklingsmuseet',
                  url: '/magasin/0615c304-e7ec-46ad-aebc-399884181eaf'
                }
              ]
            },
            to: {
              path: ',1,3,4,7,',
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
                },
                {
                  nodeId: 4,
                  nodeUuid: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  name: 'Forskningens hus'
                },
                {
                  nodeId: 7,
                  nodeUuid: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  name: 'Forskningsværelset'
                }
              ],
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
                },
                {
                  id: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  nodeId: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  name: 'Forskningens hus',
                  url: '/magasin/2f339757-3dfe-4608-b5e5-3b28ea8a5a62'
                },
                {
                  id: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  nodeId: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  name: 'Forskningsværelset',
                  url: '/magasin/cd265440-bde5-40fe-b433-286baf2c0e15'
                }
              ]
            }
          }
        ]
      },
      c: {
        data: [
          {
            registeredBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
            registeredDate: '2017-02-13T14:34:51+00:00',
            doneBy: '00000000-0000-0000-0000-000000000000',
            doneDate: '2017-02-13T14:34:51+00:00',
            from: {
              path: ',1,',
              pathNames: [
                {
                  nodeId: 1,
                  nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  name: 'Utviklingsmuseet'
                }
              ],
              breadcrumb: [
                {
                  id: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  nodeId: '0615c304-e7ec-46ad-aebc-399884181eaf',
                  name: 'Utviklingsmuseet',
                  url: '/magasin/0615c304-e7ec-46ad-aebc-399884181eaf'
                }
              ]
            },
            to: {
              path: ',1,3,4,7,',
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
                },
                {
                  nodeId: 4,
                  nodeUuid: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  name: 'Forskningens hus'
                },
                {
                  nodeId: 7,
                  nodeUuid: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  name: 'Forskningsværelset'
                }
              ],
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
                },
                {
                  id: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  nodeId: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                  name: 'Forskningens hus',
                  url: '/magasin/2f339757-3dfe-4608-b5e5-3b28ea8a5a62'
                },
                {
                  id: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  nodeId: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                  name: 'Forskningsværelset',
                  url: '/magasin/cd265440-bde5-40fe-b433-286baf2c0e15'
                }
              ]
            }
          }
        ]
      }
    };

    // mock up$ and down$ events
    const clear$ = testScheduler.createHotObservable(clearM);
    const loadMoveHistory$ = testScheduler
      .createHotObservable(loadMoveHistoryM, {
        1: { objectId: 1234, museumId: 99, token: '1234' },
        2: { objectId: 4566, museumId: 2, token: '1234' },
        3: { objectId: 999, museumId: 2, token: '1234' }
      })
      .switchMap(
        getLocationHistory(
          url => {
            if (url.indexOf('objects/1234/locations') > -1) {
              return Observable.of({
                response: []
              });
            }
            if (url.indexOf('objects/4566/locations') > -1) {
              return Observable.of({
                response: [
                  {
                    registeredBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                    registeredDate: '2017-02-13T14:34:51+00:00',
                    doneBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                    doneDate: '2017-02-13T14:34:51+00:00',
                    from: {
                      path: ',1,',
                      pathNames: [
                        {
                          nodeId: 1,
                          nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                          name: 'Utviklingsmuseet'
                        }
                      ]
                    },
                    to: {
                      path: ',1,3,4,7,',
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
                        },
                        {
                          nodeId: 4,
                          nodeUuid: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                          name: 'Forskningens hus'
                        },
                        {
                          nodeId: 7,
                          nodeUuid: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                          name: 'Forskningsværelset'
                        }
                      ]
                    }
                  }
                ]
              });
            }
            if (url.indexOf('objects/999/locations') > -1) {
              return Observable.of({
                response: [
                  {
                    registeredBy: 'f7144d5d-732f-487c-b2ef-e895ab5cf163',
                    registeredDate: '2017-02-13T14:34:51+00:00',
                    doneBy: '00000000-0000-0000-0000-000000000000',
                    doneDate: '2017-02-13T14:34:51+00:00',
                    from: {
                      path: ',1,',
                      pathNames: [
                        {
                          nodeId: 1,
                          nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                          name: 'Utviklingsmuseet'
                        }
                      ]
                    },
                    to: {
                      path: ',1,3,4,7,',
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
                        },
                        {
                          nodeId: 4,
                          nodeUuid: '2f339757-3dfe-4608-b5e5-3b28ea8a5a62',
                          name: 'Forskningens hus'
                        },
                        {
                          nodeId: 7,
                          nodeUuid: 'cd265440-bde5-40fe-b433-286baf2c0e15',
                          name: 'Forskningsværelset'
                        }
                      ]
                    }
                  }
                ]
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
            if (data.find(d => d === '00000000-0000-0000-0000-000000000000')) {
              return Observable.of({
                error: {
                  status: 404
                }
              });
            }
            return Observable.of({
              response: []
            });
          }
        )
      );

    const state$ = store$({ clear$, loadMoveHistory$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
