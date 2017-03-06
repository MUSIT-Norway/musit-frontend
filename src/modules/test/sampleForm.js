import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  stringMapper,
  numberMapper
} from '../../forms/mappers';
import {
  isDecimalNumber,
  isNumberInRange
} from '../../forms/validators';
import {
  composeValidators,
  isRequired,
  isAlphaNumeric
} from 'revalidate';

const hid: Field<number> = {
  name: 'hid',
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isDecimalNumber(0, 3)),
    valueValidator: isNumberInRange(-1000, +1000)
  }
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  mapper: stringMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isAlphaNumeric)
  }
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  mapper: stringMapper
};

export default createForm('sampleForm', [ hid, registeredBy, registeredDate ]);
