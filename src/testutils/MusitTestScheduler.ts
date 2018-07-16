// @flow
import { DiffPatcher } from 'jsondiffpatch';
import { log } from 'jsondiffpatch/src/formatters/console';
import * as assert from 'assert';
import { TestScheduler } from 'rxjs';
import * as DeepDiff from 'deep-diff';
import { TODO } from '../types/common';

export default class MusitTestScheduler extends TestScheduler {
  constructor() {
    const localAssertDeepEqual = (actual: any, expected: any) => {
      const difference = DeepDiff.diff(actual, expected);
      if (typeof difference !== 'undefined') {
        const theDiff = (DiffPatcher as TODO).diff(actual, expected);
        log(theDiff);
        console.log('ACTUAL:', JSON.stringify(actual, null, 2));
        console.log('EXPECTED:', JSON.stringify(expected, null, 2));
      }
      return assert.equal(undefined, difference);
    };
    super(localAssertDeepEqual);
    this.assertDeepEqual = localAssertDeepEqual; //Not sure if this is needed
  }
}
