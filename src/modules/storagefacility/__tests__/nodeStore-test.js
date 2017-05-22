import { store$ } from '../nodeStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';
describe('nodeStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();
    // mock streams
    const clearNodeM = '-1---------';
    const loadNodeM = '--1--------';
    const updateStateM = '---1-------';
    const expected = 'abcd-------';

    const expectedStateMap = {
      a: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: false
      },
      b: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: false
      },
      c: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {}
        },
        loaded: true,
        rootNode: { foo: 'bar' }
      },
      d: {
        unit: {
          environmentRequirement: {},
          environmentAssessment: {},
          securityAssessment: {},
          bar: 'foo'
        },
        loaded: true,
        rootNode: { foo: 'bar' }
      }
    };

    // mock up$ and down$ events
    const clearNode$ = testScheduler.createHotObservable(clearNodeM);
    const loadNode$ = testScheduler.createHotObservable(loadNodeM, { 1: { foo: 'bar' } });
    const updateState$ = testScheduler.createHotObservable(updateStateM, {
      1: { bar: 'foo' }
    });

    const state$ = store$({ clearNode$, loadNode$, updateState$ });

    // assertion
    testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
