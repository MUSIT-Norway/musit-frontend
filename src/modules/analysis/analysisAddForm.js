/* @flow */
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isNumber,
  isRequired,
  isNumberInRange //,
//  isSpecialPhone
} from '../../forms/validators';

// import type {
//   Phone
// } from '../../forms/types';
import {
  stringMapper,
  numberMapper,
  booleanMapper//,
  // specialPhoneMapper
} from '../../forms/mappers';


const getStrField = (field, value = ''): Field<string> => {
  return  {
    name: field,
    mapper: stringMapper,
    defaultValue: value,
    validator: {
      rawValidator: isRequired
    }
  };
};

const getBoolField = (field, value = false): Field<boolean> => {
  return  {
    name: field,
    defaultValue: value,
    mapper: booleanMapper,
    validator: {
    }
  };
};

const id = getStrField('id', '123');
const registeredBy = getStrField('registeredBy', 'Per Hansen');
const registeredDate = getStrField('registeredDate', '12.12.2012');
const doneBy = getStrField('doneBy', 'Per Hansen');
const doneDate = getStrField('doneDate', '12.12.2012');
const eventDate = getStrField('eventDate', '13.12.2012');
const objectId = getStrField('objectId', '1234456');
const partOf = getStrField('partOf', '2345');
const result = getStrField('result', 'result');
const actor = getStrField('actor', 'Test Name Actor');
const role = getStrField('role', 'Creator');
const place = getStrField('place', 'Oslo, Norway');
const analysisTypeId = getStrField('analysisTypeId', 'b15ee459-38c9-414f-8b54-7c6439b44d3d');
const externalSource = getStrField('externalSource', 'www.musit.uio.no');
const comments = getStrField('comments', 'comments');
const restrictions = getBoolField('restrictions', true);
const restrictionsFor = getStrField('restrictionsFor', 'Test name');
const reasonForRestrictions = getStrField('reasonForRestrictions', 'Reason for Restrictions');
const restrictionsEndDate = getStrField('restrictionsEndDate', '13.12.2012');
const repealedBy = getStrField('repealedBy', 'repealed By Person Name');
const note = getStrField('note', 'default value of note');
const completeAnalysis = getBoolField('completeAnalysis', true);

const caseNumber: Field<number> = {
  name: 'caseNumber',
  mapper: numberMapper,
  defaultValue: 1234,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, 2)),
    valueValidator: isNumberInRange(0, 10)
  }
};


const fieldsArray = [
  id,
  registeredBy,
  registeredDate,
  doneBy,
  doneDate,
  eventDate,
  objectId,
  partOf,
  result,
  caseNumber,
  actor,
  role,
  place,
  analysisTypeId,
  externalSource,
  comments,
  restrictions,
  restrictionsFor,
  reasonForRestrictions,
  restrictionsEndDate,
  repealedBy,
  note,
  completeAnalysis
];
export default createForm('analysisAddForm.js', fieldsArray);


