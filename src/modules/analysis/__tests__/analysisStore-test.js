import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { store$ } from '../analysisStore';
const diff = require('deep-diff').diff;

describe('analysisStore', () => {
  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      //console.log(JSON.stringify(actual, null, 2));
      //console.log(JSON.stringify(expected, null, 2));
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const loadAnalysisTypesM = '--1--------';
    const getAnalysisTypesForCollectionM = '---1-------';
    const loadAnalysisM = '-1---------';
    const expected = 'abcd-------';

    const expectedStateMap = {
      a: {
        analysisTypes: [],
        analysis: []
      },
      b: {
        analysisTypes: [],
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
        },
        loading: false
      },
      c: {
        analysisTypes: [
          {
            id: 'fabe6462-ea94-43ce-bf7f-724a4191e114',
            category: 2,
            name: 'C/N-ratio',
            shortName: 'C/N',
            collections: [
              'fcb4c598-8b05-4095-ac00-ce66247be38a',
              'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
              '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
              '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
              '7352794d-4973-447b-b84e-2635cafe910a',
              'ba3d4d30-810b-4c07-81b3-37751f2196f0',
              'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4'
            ]
          }
        ],
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
        },
        loading: false
      },
      d: {
        analysisTypes: [
          {
            id: '55fdf44b-f4dc-45d1-bdb6-ee6e745123a0',
            category: 2,
            name: 'LA-ICP-MS (sporelementer)',
            shortName: 'La-ICP-MS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          },
          {
            id: '80a4f3e1-5b45-433f-83c0-8a388364beba',
            category: 2,
            name: 'Pyrolyse gasskromatografi-massespektrometri',
            shortName: 'Py-GC/MS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          },
          {
            id: '38c1d623-4005-4562-aa57-0efbeee2837d',
            category: 2,
            name: 'Atomabsorbsjonspektroskopi',
            shortName: 'AAS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          }
        ],
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
        },
        loading: false
      }
    };

    // mock up$ and down$ events
    const loadAnalysis$ = testScheduler.createHotObservable(loadAnalysisM, {
      '1': {
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
    });
    const loadAnalysisTypes$ = testScheduler.createHotObservable(loadAnalysisTypesM, {
      '1': [
        {
          id: 'fabe6462-ea94-43ce-bf7f-724a4191e114',
          category: 2,
          name: 'C/N-ratio',
          shortName: 'C/N',
          collections: [
            'fcb4c598-8b05-4095-ac00-ce66247be38a',
            'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
            '23ca0166-5f9e-44c2-ab0d-b4cdd704af07',
            '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
            '7352794d-4973-447b-b84e-2635cafe910a',
            'ba3d4d30-810b-4c07-81b3-37751f2196f0',
            'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4'
          ]
        }
      ]
    });
    const getAnalysisTypesForCollection$ = testScheduler.createHotObservable(
      getAnalysisTypesForCollectionM,
      {
        '1': [
          {
            id: '55fdf44b-f4dc-45d1-bdb6-ee6e745123a0',
            category: 2,
            name: 'LA-ICP-MS (sporelementer)',
            shortName: 'La-ICP-MS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          },
          {
            id: '80a4f3e1-5b45-433f-83c0-8a388364beba',
            category: 2,
            name: 'Pyrolyse gasskromatografi-massespektrometri',
            shortName: 'Py-GC/MS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          },
          {
            id: '38c1d623-4005-4562-aa57-0efbeee2837d',
            category: 2,
            name: 'Atomabsorbsjonspektroskopi',
            shortName: 'AAS',
            collections: [
              '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
              '88b35138-24b5-4e62-bae4-de80fae7df82',
              '8bbdf9b3-56d1-479a-9509-2ea82842e8f8'
            ]
          }
        ]
      }
    );
    const state$ = store$({
      loadAnalysis$,
      loadAnalysisTypes$,
      getAnalysisTypesForCollection$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
