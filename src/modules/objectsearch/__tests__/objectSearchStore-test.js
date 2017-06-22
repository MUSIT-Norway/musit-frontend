import { Observable, Subject } from 'rxjs/Rx';
import { initialState, searchForObjects, store$ } from '../objectSearchStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('objectSearchStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
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
          totalMatches: 31,
          matches: [
            {
              id: 14,
              museumId: 99,
              museumNo: 'MusK23',
              term: 'Lite skaft av ben',
              currentLocationId: 7,
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
            },
            {
              id: 15,
              museumId: 99,
              museumNo: 'MusK24',
              subNo: 'a',
              term: 'Lendeklede',
              currentLocationId: 7,
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
            },
            {
              id: 16,
              museumId: 99,
              museumNo: 'MusK24',
              subNo: 'b',
              term: 'Kokekar',
              currentLocationId: 1,
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
            {
              id: 20,
              museumId: 99,
              museumNo: 'MusK33',
              term: 'Bronsjespenne',
              currentLocationId: 1,
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
            {
              id: 21,
              museumId: 99,
              museumNo: 'MusK34',
              subNo: 'a',
              term: 'Kniv',
              currentLocationId: 1,
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
            }
          ]
        },
        params: {
          ...initialState.params,
          test: 'hallo'
        }
      }
    };

    // mock up$ and down$ events
    const clearSearch$ = new Subject();
    const clearStore$ = new Subject();
    const searchForObjects$ = testScheduler
      .createHotObservable(searchForObjectsdM, {
        x: {
          params: {},
          token: '12344',
          museumId: 1,
          collectionId: '12345'
        }
      })
      .switchMap(
        searchForObjects(() => {
          return Observable.of({
            response: {
              totalMatches: 31,
              matches: [
                {
                  id: 14,
                  museumId: 99,
                  museumNo: 'MusK23',
                  term: 'Lite skaft av ben',
                  currentLocationId: 7,
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
                },
                {
                  id: 15,
                  museumId: 99,
                  museumNo: 'MusK24',
                  subNo: 'a',
                  term: 'Lendeklede',
                  currentLocationId: 7,
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
                },
                {
                  id: 16,
                  museumId: 99,
                  museumNo: 'MusK24',
                  subNo: 'b',
                  term: 'Kokekar',
                  currentLocationId: 1,
                  path: ',1,',
                  pathNames: [
                    {
                      nodeId: 1,
                      nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                      name: 'Utviklingsmuseet'
                    }
                  ]
                },
                {
                  id: 20,
                  museumId: 99,
                  museumNo: 'MusK33',
                  term: 'Bronsjespenne',
                  currentLocationId: 1,
                  path: ',1,',
                  pathNames: [
                    {
                      nodeId: 1,
                      nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                      name: 'Utviklingsmuseet'
                    }
                  ]
                },
                {
                  id: 21,
                  museumId: 99,
                  museumNo: 'MusK34',
                  subNo: 'a',
                  term: 'Kniv',
                  currentLocationId: 1,
                  path: ',1,',
                  pathNames: [
                    {
                      nodeId: 1,
                      nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
                      name: 'Utviklingsmuseet'
                    }
                  ]
                }
              ]
            }
          });
        })
      );
    const onChangeField$ = testScheduler.createHotObservable(onChangeFieldM, {
      x: { field: 'test', value: 'hallo' }
    });

    const state$ = store$({
      clearSearch$,
      searchForObjects$,
      onChangeField$,
      clearStore$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
