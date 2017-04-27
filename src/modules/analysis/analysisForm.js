/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  isNonEmptyArray,
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange
} from '../../forms/validators';
import { stringMapper, numberMapper, booleanMapper, noMapper } from '../../forms/mappers';

export const getStrField = (field: string): Field<string> => ({
  name: field,
  mapper: stringMapper,
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

export const getArrField = (field: string, value: Array<*> = []): Field<Array<*>> => ({
  name: field,
  defaultValue: value,
  mapper: noMapper,
  validator: {
    rawValidator: isNonEmptyArray
  }
});

const id = getStrField('id');
const analysisTypeId = getStrField('analysisTypeId');
const doneBy = getStrField('doneBy');
const doneDate = getStrField('doneDate');
const registeredBy = getStrField('registeredBy');
const registeredByName = getStrField('registeredByName');
const registeredDate = getStrField('registeredDate');
const responsible = getStrField('responsible');
const administrator = getStrField('administrator');
const completedBy = getStrField('completedBy');
const completedDate = getStrField('completedDate');
const objectId = getStrField('objectId');
const museumNo = getStrField('museumNo');
const term = getStrField('term');
const subNo = getStrField('subNo');
const partOf = getStrField('partOf');
const place = getStrField('place');
const externalSource = getStrField('externalSource');
const comments = getStrField('comments');
const result = getStrField('result');
const restrictions = getBoolField('restrictions', true);
const by = getStrField('by');
const reason = getStrField('reason');
const expirationDate = getStrField('expirationDate');
const cancelledBy = getStrField('cancelledBy');
const cancelledReason = getStrField('cancelledReason');
const note = getStrField('note');
const type = getStrField('type');
const completeAnalysis = getBoolField('completeAnalysis', true);
const events = getArrField('events', []);
const caseNumbers: Field<number> = {
  name: 'caseNumbers',
  mapper: numberMapper,
  defaultValue: 1234,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, 10)
  }
};

export const fieldsArray = [
  id,
  analysisTypeId,
  doneBy,
  doneDate,
  registeredBy,
  registeredByName,
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
  subNo,
  term,
  events
];

export default createForm('analysisForm.js', fieldsArray);
