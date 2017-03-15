/* @flow */
import type {Field} from '../../forms/form';
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

const container: Field<string> = {
  name: 'container',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const storageMedium: Field<string> = {
  name: 'storageMedium',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const note: Field<string> = {
  name: 'note',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sampleSize: Field<number> = {
  name: 'sampleSize',
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, 10)
  }
};

const sampleType: Field<string> = {
  name: 'sampleType',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sizeUnit: Field<string> = {
  name: 'sizeUnit',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sampleSubType: Field<string> = {
  name: 'sampleSubType',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const status: Field<string> = {
  name: 'status',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};


export default createForm('sampleFormAdd.js', [note, status, sampleSize, sizeUnit, container, storageMedium, sampleSubType, sampleType]);
