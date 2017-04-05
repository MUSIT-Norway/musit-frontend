import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { sampleStore$ } from '../sampleStore';
const diff = require('deep-diff').diff;

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      /* console.log(JSON.stringify(actual, null, 2));
       console.log(JSON.stringify(expected, null, 2));*/
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        // console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const clearM = '-1---------';
    const loadSampleStoreM = '--1--------';
    const expected = 'aab--------';

    const expectedStateMap = {
      a: {
        data: []
      },
      b: {
        data: [
          {
            createdDate: '1992-01-01',
            sampleType: 'Vev',
            sampleSubType: 'Blod',
            status: 1
          },
          {
            createdDate: '1956-01-01',
            sampleType: 'Tekstil',
            sampleSubType: 'Ull',
            status: 2
          }
        ],
        museumNo: 'MUS-1',
        subNo: 'AAA',
        term: 'Carex'
      }
    };

    // mock up$ and down$ events
    const clear$ = testScheduler.createHotObservable(clearM);
    const loadSamplesForObject$ = testScheduler.createHotObservable(loadSampleStoreM, {
      1: {
        data: [
          {
            createdDate: '1992-01-01',
            sampleType: 'Vev',
            sampleSubType: 'Blod',
            status: 1
          },
          {
            createdDate: '1956-01-01',
            sampleType: 'Tekstil',
            sampleSubType: 'Ull',
            status: 2
          }
        ],
        museumNo: 'MUS-1',
        subNo: 'AAA',
        term: 'Carex'
      }
    });

    const state$ = sampleStore$({ clear$, loadSamplesForObject$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
