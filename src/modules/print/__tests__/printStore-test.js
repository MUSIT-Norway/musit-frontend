import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import { reducer$ } from '../printStore';
import { createStore } from 'react-rxjs/dist/RxStore';

describe('printStore', () => {

  it('testing reducer', () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

    // mock streams
    const clearAllM         = '--------------';
    const clearRenderedM    = '--------------';
    const loadTemplatesM    = '--------------';
    const renderTemplateM   = '--------------';
    const expected          = 'a-------------';

    const expectedStateMap = {
      a: {}
    };

    // mock up$ and down$ events
    const clearAll$ = testScheduler.createHotObservable(clearAllM);
    const clearRendered$ = testScheduler.createHotObservable(clearRenderedM);
    const loadTemplates$ = testScheduler.createHotObservable(loadTemplatesM);
    const renderTemplate$ = testScheduler.createHotObservable(renderTemplateM);

    const state$ = reducer$({clearAll$, clearRendered$, loadTemplates$, renderTemplate$});

    // assertion
    testScheduler.expectObservable(createStore('test', state$)).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});