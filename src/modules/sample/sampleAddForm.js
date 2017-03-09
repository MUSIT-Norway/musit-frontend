/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange
} from '../../forms/validators';
import {
  stringMapper,
  numberMapper
} from '../../forms/mappers';

const note: Field<string> = {
  name: 'note',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const weight: Field<number> = {
  name: 'weight',
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, 10)
  }
};

export default createForm('sampleFormAdd.js', [ note, weight ]);
