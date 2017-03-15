/* @flow */
declare var describe: any;
declare var it: any;

import { TestScheduler, Subject } from 'rxjs/Rx';
import assert from 'assert';
import createForm  from '../form';
import { stringMapper } from '../mappers';
import type { Field } from '../form';
import type { Update } from '../form';
const diff = require('deep-diff').diff;

const minLength = (length: number) => (field: string) => (value: ?string) => {
  const valid = value && value.length >= length;
  if (!valid) {
    return field + ' is not valid';
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
    const loadM         = '----xyz--------';
    const updateFieldM  = '-xyz-----------';
    const expected      = 'abccdde--------';

    const validator = {
      rawValidator: minimumThreeChars
    };

    const expectedStateMap = {
      a: {
        name: {
          name: 'name',
          rawValue: null,
          validator: validator,
          mapper: stringMapper
        }
      },
      b: {
        name: {
          name: 'name',
          validator: validator,
          mapper: stringMapper,
          rawValue: 'Ja',
          value: 'Ja',
          status: {
            valid: false,
            error: 'name is not valid'
          }
        }
      },
      c: {
        name: {
          name: 'name',
          validator: validator,
          mapper: stringMapper,
          rawValue: 'Jar',
          value: 'Jar',
          status: {
            valid: true
          }
        }
      },
      d: {
        name: {
          name: 'name',
          validator: validator,
          mapper: stringMapper,
          rawValue: 'Kalle',
          value: 'Kalle',
          defaultValue: 'Kalle',
          status: {
            valid: true
          }
        }
      },
      e: {
        name: {
          name: 'name',
          validator: validator,
          mapper: stringMapper,
          rawValue: 'pe',
          value: 'pe',
          defaultValue: 'pe',
          status: {
            valid: false,
            error: 'name is not valid'
          }
        }
      }
    };

    const name: Field<string> = {
      name: 'name',
      mapper: stringMapper,
      validator: validator
    };

    const update$: Subject<Update<*>> = testScheduler.createHotObservable(updateFieldM, {
      x: {
        name: 'name',
        rawValue: 'Ja'
      },
      y: {
        name: 'name',
        rawValue: 'Jar'
      },
      z: {
        name: 'bogus name that does not exist',
        rawValue: 'some great value'
      }
    });

    const load$: Subject<Update<*>[]> = testScheduler.createHotObservable(loadM, {
      x: [
        {
          name: 'name',
          rawValue: 'Kalle',
          defaultValue: 'Kalle'
        }
      ],
      y: [
        {
          name: 'bogus name that does not exist',
          rawValue: 'Silly value',
          defaultValue: 'Silly value'
        }
      ],
      z: [
        {
          name: 'name',
          defaultValue: 'pe'
        }
      ]
    });

    const testForm = createForm('test', [name], update$, load$);

    // assertion
    testScheduler.expectObservable(testForm.form$).toBe(expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});