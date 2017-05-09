import DiffPatcher from 'jsondiffpatch';
import { log } from 'jsondiffpatch/src/formatters/console';
import assert from 'assert';
import { TestScheduler } from 'rxjs/Rx';
import DeepDiff from 'deep-diff';

export default class MusitTestScheduler extends TestScheduler {
  constructor() {
    super();
    this.assertDeepEqual = (actual, expected) => {
      const difference = DeepDiff.diff(actual, expected);
      if (typeof difference !== 'undefined') {
        const theDiff = DiffPatcher.diff(actual, expected);
        log(theDiff);
      }
      return assert.equal(undefined, difference);
    };
  }
}
