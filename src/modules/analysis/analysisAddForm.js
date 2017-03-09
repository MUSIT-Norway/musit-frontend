/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  isRequired
} from '../../forms/validators';

import {
  stringMapper
} from '../../forms/mappers';

const note: Field<string> = {
  name: 'note',
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
};


export default createForm('analysisAddForm.js', [ note ]);

