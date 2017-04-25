/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange
} from '../../forms/validators';

import { stringMapper, numberMapper } from '../../forms/mappers';

const museumId: Field<string> = {
  name: 'museumId',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const subNo: Field<string> = {
  name: 'subNo',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const term_species: Field<string> = {
  name: 'term_species',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const responsible: Field<string> = {
  name: 'responsible',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sampleId: Field<string> = {
  name: 'sampleId',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const createdDate: Field<string> = {
  name: 'createdDate',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const updateBy: Field<string> = {
  name: 'updateBy',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const updateDate: Field<string> = {
  name: 'updateDate',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const container: Field<string> = {
  name: 'container',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const storageMedium: Field<string> = {
  name: 'storageMedium',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const note: Field<string> = {
  name: 'note',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const size: Field<number> = {
  name: 'size',
  type: 1,
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, Number.MAX_VALUE)
  }
};

const sampleType: Field<string> = {
  name: 'sampleType',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sizeUnit: Field<string> = {
  name: 'sizeUnit',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sampleSubType: Field<string> = {
  name: 'sampleSubType',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const status: Field<string> = {
  name: 'status',
  type: 1,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const fields = [
  note,
  status,
  size,
  sizeUnit,
  container,
  storageMedium,
  sampleSubType,
  sampleType,
  museumId,
  subNo,
  term_species,
  sampleId,
  registeredBy,
  registeredDate,
  responsible,
  updateBy,
  updateDate,
  createdDate
];

export default createForm('sampleForm.js', fields);
