import { TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
import { store$, initialState } from '../sampleStore';
const diff = require('deep-diff').diff;
import MuseumId from '../../../models/museumId';
import Sample from '../../../models/sample';
import { Observable } from 'rxjs';

describe('nodeStore', () => {

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

    const clearM        = '-x--x';
    const loadSampleM   = '--x--';
    const editSampleM   = '---x-';
    const expected      = 'aabca';

    const expectedStateMap = {
      a: initialState,
      b: {...initialState, data: {...initialState.data, id: 60 }},
      c: {...initialState, data: {...initialState.data, id: 40 }}
    };

    const clearForm$ = testScheduler.createHotObservable(clearM);
    const loadSample$ = testScheduler.createHotObservable(loadSampleM, {
      x: { id: 50, museumId: new MuseumId(99), token: '1234' }
    }).flatMap(Sample.loadSample(() => {
      return Observable.of({
        response: {
          id: 60
        }
      });
    }));
    const editSample$ = testScheduler.createHotObservable(editSampleM, {
      x: { id: 50, museumId: new MuseumId(99), token: '1234', data: { fugl: 'fisk' } }
    }).flatMap(Sample.editSample(() => {
      return Observable.of({
        response: {
          id: 40
        }
      });
    }));

    const state$ = store$({ clearForm$, loadSample$, editSample$ });

        // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

        // run tests
    testScheduler.flush();
  });
});