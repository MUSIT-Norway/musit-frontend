import { sampleStore$ } from '../sampleStore';
import MusitTestScheduler from 'testutils/MusitTestScheduler';

describe('eventsStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

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
