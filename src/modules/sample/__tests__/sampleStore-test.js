import {TestScheduler, Observable} from 'rxjs/Rx';
import assert from 'assert';
import {store$} from '../sampleStore';
import {editSample, loadSample} from '../../../models/sample';
const diff = require('deep-diff').diff;


describe('sampleStore', () => {

  it('testing reducer with actors', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      const difference = diff(actual, expected);
      if (typeof difference !== 'undefined') {
        console.log(difference);
      }
      return assert.equal(undefined, difference);
    });

    // mock streams
    const clearFormM = '-1--------------';
    const loadSampleM = '--1-------------';
    const editSampleM = '---1------------';
    const expected = '-abc------------';

    const expectedStateMap = {
      a: {
        data: {},
        loaded: false,
      },
      b: {
        data: {
          sampleId: 'xxxxxx-3433-3443-yyyyyy'
        },
        loaded: true
      },
      c: {
        data: {},
        loading: false
      }
    };

    const clearForm$ = testScheduler.createHotObservable(clearFormM);
    const loadSample$ = testScheduler.createHotObservable(editSampleM, {
      1: {
        sampleId: 'xxxxxx-3433-3443-yyyyyy',
        museumId: new MuseumId(1),
        token: '1234'
      }
    });
    const editSample$ = testScheduler.createHotObservable(loadSampleM, {
      1: {
        data: {sampleId: 'xxxxxx-1234-2345-3456-yyyyyy'},
        loaded: true
      }
    })
      .switchMap(loadSample({
        simpleGet: (url) => Observable.of({
          response: {
            data: {
              sampleId: 'xxxxxx-3433-3443-yyyyyy'
            },
            loaded: true
          }
        })}));

    const state$ = store$({clearForm$, loadSample$, editSample$});

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  })
    ;

  });