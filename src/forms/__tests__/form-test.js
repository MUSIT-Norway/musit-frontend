/* @flow */
declare var describe: any;
declare var it: any;

import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import createForm  from '../form';
import type { Field } from '../form';
import type { Update } from '../form';
const diff = require('deep-diff').diff;

const minLength = (length: number) => (value: string) => {
  const valid = value.length >= length;
  if (!valid) {
    return 'Name is not valid';
  }
};

const minimumThreeChars = minLength(3);

describe('form stream', () => {

  it('should validate updates', () => {
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
    const updateFieldM  = '-123-----------';
    const expected      = 'abcc-----------';

    const expectedStateMap = {
      a: [
        {
          name: 'name',
          validator: minimumThreeChars
        }
      ],
      b: [
        {
          name: 'name',
          validator: minimumThreeChars,
          value: 'Ja',
          status: {
            valid: false,
            error: 'Name is not valid'
          }
        }
      ],
      c: [
        {
          name: 'name',
          validator: minimumThreeChars,
          value: 'Jar',
          status: {
            valid: true
          }
        }
      ]
    };

    const name: Field<string> = {
      name: 'name',
      validator: minimumThreeChars
    };

    const update$: Subject<Update<*>> = testScheduler.createHotObservable(updateFieldM, {
      [1]: {
        name: 'name',
        value: 'Ja'
      },
      [2]: {
        name: 'name',
        value: 'Jar'
      },
      [3]: {
        name: 'bogus name that does not exist',
        value: 'some great value'
      }
    });

    const form$ = createForm('test', [name], update$);

    // assertion
    testScheduler.expectObservable(form$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});