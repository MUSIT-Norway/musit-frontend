/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange,
  isSpecialPhone
} from '../../forms/validators';
import type {
  Phone
} from '../../forms/types';
import {
  stringMapper,
  numberMapper,
  specialPhoneMapper
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

const phone: Field<Phone> = {
  name: 'phone',
  mapper: specialPhoneMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isSpecialPhone)
  }
};

export default createForm('sampleFormAdd.js', [ note, weight, phone ]);
