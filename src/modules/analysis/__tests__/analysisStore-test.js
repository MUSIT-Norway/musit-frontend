import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { store$ } from '../analysisStore';
const diff = require('deep-diff').diff;

describe('analysisStore', () => {

  it('testing reducer', () => {
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
    const loadAnalysisTypesM              = '-----------';
    const getAnalysisTypesForCollectionM  = '-----------';
    const loadAnalysisM                   = '-1---------';
    const expected                        = 'ab---------';

    const expectedStateMap = {
      a: {
        objectsData: [
          {
            museumNumber: 'MusK58',
            subNumber: '2',
            term: 'Mansjettknapp',
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
          },
          {
            museumNumber: 'MusK58',
            subNumber: '3',
            term: 'Spenne',
            uuid: '798181c9-a6d9-46d7-8d71-b39d4f3e0c96'
          },
          {
            museumNumber: 'MusK58',
            subNumber: '4',
            term: 'Briller',
            uuid: 'e1f5efa5-4c91-4c5d-83a7-280c6d2f0e05'
          }
        ],
        analysisTypes: [],
        analysis: []
      },
      b: {
        objectsData: [
          {
            museumNumber: 'MusK58',
            subNumber: '2',
            term: 'Mansjettknapp',
            uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
          },
          {
            museumNumber: 'MusK58',
            subNumber: '3',
            term: 'Spenne',
            uuid: '798181c9-a6d9-46d7-8d71-b39d4f3e0c96'
          },
          {
            museumNumber: 'MusK58',
            subNumber: '4',
            term: 'Briller',
            uuid: 'e1f5efa5-4c91-4c5d-83a7-280c6d2f0e05'
          }
        ],
        analysisTypes: [],
        analysis :{
          analysisTypeId:'8453873d-227c-4205-a231-bf7e04164fab',
          eventDate : '2017-03-16T14:37:45+00:00',
          id : 2,
          museumNo : 'MusK58',
          note : 'fdsfsd sdsa 2',
          objectId : 'adea8141-8099-4f67-bff9-ea5090e18335',
          partOf : 1,
          registeredBy : '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
          registeredByName : 'Rituvesh Kumar',
          registeredDate : '2017-04-03T10:36:34+00:00',
          subNo : '2',
          term : 'Mansjettknapp',
          type : 'Analysis'
        },
        loading: false
      }
    };

    // mock up$ and down$ events
    const loadAnalysis$ = testScheduler.createHotObservable(loadAnalysisM,
      { 1: {
        analysisTypeId:'8453873d-227c-4205-a231-bf7e04164fab',
        eventDate : '2017-03-16T14:37:45+00:00',
        id : 2,
        museumNo : 'MusK58',
        note : 'fdsfsd sdsa 2',
        objectId : 'adea8141-8099-4f67-bff9-ea5090e18335',
        partOf : 1,
        registeredBy : '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        registeredByName : 'Rituvesh Kumar',
        registeredDate : '2017-04-03T10:36:34+00:00',
        subNo : '2',
        term : 'Mansjettknapp',
        type : 'Analysis'
      }});
    const loadAnalysisTypes$ = testScheduler.createHotObservable(loadAnalysisTypesM);
    const getAnalysisTypesForCollection$ = testScheduler.createHotObservable(getAnalysisTypesForCollectionM);
    const state$ = store$({loadAnalysis$, loadAnalysisTypes$, getAnalysisTypesForCollection$});

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});