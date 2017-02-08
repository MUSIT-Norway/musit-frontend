import { TestScheduler, Observable } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$, getObservation, loadRootNode } from '../observationStore';
import { createStore } from 'react-rxjs/dist/RxStore';
import MuseumId from '../../../models/museumId';
const diff = require('deep-diff').diff;

describe('printStore', () => {
  /*eslint-disable */
  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(JSON.stringify(difference, null, 2));
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const setLoadingM       = '-1------------';
    const getObservationM   = '--1-----------';
    const loadRootNodeM     = '---1----------';
    const expected          = 'abcd----------';

    const expectedStateMap = {
      a: {},
      b: {
        data: {},
        rootNode: null,
        loading: true
      },
      c: {
        data: {
          doneBy: "Jarl",
          doneDate: "2017-02-08T09:00:50+00:00",
          registeredBy: "Jarl",
          registeredDate: "2017-02-08T09:01:07+00:00",
          observations: [
            {
              type: "gas",
              data: {
                leftValue: "pppppppppppppppp",
                rightValue: undefined
              }
            },
            {
              type: "pest",
              data: {
                identificationValue: "kkk",
                observations: [
                  {
                    lifeCycle: "puppe",
                    count: "6"
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
          doneBy: "Jarl",
          doneDate: "2017-02-08T09:00:50+00:00",
          registeredBy: "Jarl",
          registeredDate: "2017-02-08T09:01:07+00:00",
          observations: [
            {
              type: "gas",
              data: {
                leftValue: "pppppppppppppppp",
                rightValue: undefined
              }
            },
            {
              type: "pest",
              data: {
                identificationValue: "kkk",
                observations: [
                  {
                    lifeCycle: "puppe",
                    count: "6"
                  }
                ]
              }
            }
          ]
        },
        rootNode: {
          id: 3,
          nodeId: "d3982b48-56c7-4d27-bc81-6e38b59d57ed",
          name: "Utviklingsmuseet Org",
          isPartOf: 1,
          path: ",1,3,",
          pathNames: [{nodeId: 1, name: "Utviklingsmuseet"}, {nodeId: 3, name: "Utviklingsmuseet Org"}],
          updatedBy: "d63ab290-2fab-42d2-9b57-2475dfbd0b3c",
          updatedDate: "2015-12-31T23:00:00+00:00",
          type: "Organisation",
          breadcrumb:  [
            {
              "id": 1,
              "name": "Utviklingsmuseet",
              "url": "/magasin/1"
            },
            {
              "id": 3,
              "name": "Utviklingsmuseet Org",
              "url": "/magasin/3"
            }
          ]
        },
        loading: false
      }
    };

    // mock up$ and down$ events
    const loadRootNode$ = testScheduler.createHotObservable(loadRootNodeM, {1: { nodeId: 3, museumId: new MuseumId(99), token: '1234'}})
      .switchMap(loadRootNode({
        simpleGet: () => Observable.of({
          response: {
            id: 3,
            nodeId: "d3982b48-56c7-4d27-bc81-6e38b59d57ed",
            name: "Utviklingsmuseet Org",
            isPartOf: 1,
            path: ",1,3,",
            pathNames: [{nodeId: 1, name: "Utviklingsmuseet"}, {nodeId: 3, name: "Utviklingsmuseet Org"}],
            updatedBy: "d63ab290-2fab-42d2-9b57-2475dfbd0b3c",
            updatedDate: "2015-12-31T23:00:00+00:00",
            type: "Organisation"
          }
        })
      }));
    const setLoading$ = testScheduler.createHotObservable(setLoadingM);
    const getObservation$ = testScheduler.createHotObservable(getObservationM, { 1: { nodeId: 3, observationId: 41, museumId: new MuseumId(99), token: '1234'}})
      .switchMap(getObservation({
        simpleGet: () => Observable.of({
          response: {
            id: 41,
            doneBy: "00000000-0000-0000-0000-000000000000",
            doneDate: "2017-02-08T09:00:50+00:00",
            affectedThing: 3,
            registeredBy: "00000000-0000-0000-0000-000000000000",
            registeredDate: "2017-02-08T09:01:07+00:00",
            eventType: "Observation",
            gas: {gas: "pppppppppppppppp"},
            pest: {identification: "kkk", lifecycles: [{stage: "puppe", quantity: 6}]}
          }
        }),
        simplePost: () => Observable.of({
          response: [
            {
              dataportenId: '00000000-0000-0000-0000-000000000000',
              fn: 'Jarl'
            }
          ]
        })
      }));

    const state$ = reducer$({loadRootNode$, setLoading$, getObservation$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});