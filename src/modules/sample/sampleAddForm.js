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

const museumId: Field<string> = {
  name: 'museumId',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const subNo: Field<string> = {
  name: 'subNo',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const term_species: Field<string> = {
  name: 'term_species',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const responsible: Field<string> = {
  name: 'responsible',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const sampleId: Field<string> = {
  name: 'sampleId',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const createdDate: Field<string> = {
  name: 'createdDate',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const updateBy: Field<string> = {
  name: 'updateBy',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};

const updateDate: Field<string> = {
  name: 'updateDate',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};


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


export default createForm('sampleFormAdd.js', [note, status, sampleSize, sizeUnit, container,
  storageMedium, sampleSubType, sampleType, museumId, subNo, term_species, sampleId, registeredBy,
registeredDate, responsible, updateBy, updateDate, createdDate]);