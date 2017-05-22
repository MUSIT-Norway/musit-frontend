// @flow
import { Subject } from 'rxjs/Rx';
import createForm from '../form';
import { stringMapper } from '../mappers';
import type { Field, RawValue, Update } from '../form';
import MusitTestScheduler from '../../testutils/MusitTestScheduler';

declare var describe: any;
declare var it: any;

const minLength = (length: number) =>
  (field: string) =>
    (value: ?RawValue) => {
      const valid = typeof value === 'string' && value.length >= length;
      if (!valid) {
        return field + ' is not valid';
      }
    };

const minimumThreeChars = minLength(3);

describe('form stream', () => {
  it('should validate updates', () => {
    const testScheduler = new MusitTestScheduler();

    // mock streams
    const loadM = '----xyz--------';
    const updateFieldM = '-xyz-----------';
    const expected = 'abccdde--------';

    const validator = {
      rawValidator: minimumThreeChars
    };

    const expectedStateMap = {
      a: {
        name: {
          name: 'name',
          rawValue: '1',
          defaultValue: '1',
          validator: validator,
          mapper: stringMapper,
          status: {
            valid: false,
            error: 'name is not valid'
          },
          value: '1'
        }
      },
      b: {
        name: {
          name: 'name',
          validator: validator,
          mapper: stringMapper,
          rawValue: 'Ja',
          defaultValue: '1',
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
          defaultValue: '1',
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
      defaultValue: '1',
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
          defaultValue: 'Kalle'
        }
      ],
      y: [
        {
          name: 'bogus name that does not exist',
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
