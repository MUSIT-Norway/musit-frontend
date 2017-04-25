/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange
} from '../../forms/validators';
import { stringMapper, numberMapper, booleanMapper } from '../../forms/mappers';

export const getStrField = (field: string, value: string = ''): Field<string> => ({
  name: field,
  mapper: stringMapper,
  defaultValue: value,
  validator: {
    rawValidator: isRequired
  }
});

export const getBoolField = (field: string, value: boolean = false): Field<boolean> => ({
  name: field,
  defaultValue: value,
  mapper: booleanMapper,
  validator: {}
});

const id = getStrField('id', '123');
const analysisTypeId = getStrField(
  'analysisTypeId',
  'b15ee459-38c9-414f-8b54-7c6439b44d3d'
);
const doneBy = getStrField('doneBy', '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e');
const doneDate = getStrField('doneDate', '12.12.2012');
const registeredBy = getStrField('registeredBy', '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e');
const registeredDate = getStrField('registeredDate', '2017-03-16T14:37:45+00:00');
const responsible = getStrField('responsible', '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e');
const administrator = getStrField(
  'administrator',
  '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e'
);
const completedBy = getStrField('completedBy', '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e');
const completedDate = getStrField('completedDate', '2017-03-16T14:37:45+00:00');
const objectId = getStrField('objectId', '');
const museumNo = getStrField('museumNo', '');
const term = getStrField('term', '');

const partOf = getStrField('partOf', '2345');
const place = getStrField('place', 'Oslo, Norway');

const externalSource = getStrField('externalSource', 'www.musit.uio.no');
const comments = getStrField('comments', 'comments');

const result = getStrField('result', 'result');
const restrictions = getBoolField('restrictions', true);
const by = getStrField('by', 'Test name');
const reason = getStrField('reason', 'Reason for Restrictions');
const caseNumbers: Field<number> = {
  name: 'caseNumbers',
  mapper: numberMapper,
  defaultValue: 1234,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, 10)
  }
};
const expirationDate = getStrField('expirationDate', '13.12.2012');
const cancelledBy = getStrField('cancelledBy', 'Opphevet av');
const cancelledReason = getStrField('cancelledReason', 'Årsak til oppheving');

const note = getStrField('note', 'default value of note');
const type = getStrField('partOf', 'Analysis');
const completeAnalysis = getBoolField('completeAnalysis', true);

export const fieldsArray = [
  id,
  analysisTypeId,
  doneBy,
  doneDate,
  registeredBy,
  registeredDate,

  responsible,

  administrator,
  completedBy,
  completedDate,
  objectId,
  note,
  type,

  partOf,
  result,
  place,

  externalSource,
  comments,

  restrictions,
  by,
  expirationDate,
  reason,
  caseNumbers,
  cancelledBy,
  cancelledReason,

  completeAnalysis,
  museumNo,
  term
];

export default createForm('analysisAddForm.js', fieldsArray);
