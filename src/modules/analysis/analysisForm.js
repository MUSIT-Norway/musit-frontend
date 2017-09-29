// @flow
import createForm, {
  getStrField,
  getArrField,
  getBoolField,
  getNumberField,
  getCompositeField
} from '../../forms/form';

export const fieldsArray = [
  getStrField('id'),
  getNumberField('analysisTypeId', null, true),
  getStrField('doneBy'),
  getStrField('doneDate'),
  getArrField('persons', [], false),
  getStrField('registeredBy', null, false),
  getStrField('registeredByName', null, false),
  getStrField('registeredDate', null, false),
  getStrField('responsible'),
  getStrField('administrator'),
  getStrField('completedBy'),
  getStrField('completedDate'),
  getStrField('objectId'),
  getStrField('note'),
  getStrField('type', null, false),
  getStrField('partOf'),
  getStrField('result'),
  getNumberField('orgId'),
  getStrField('reason'),
  getArrField('externalSource', []),
  getStrField('comments'),
  getBoolField('restrictions', false),
  getCompositeField('restriction', {}),
  getArrField('caseNumbers'),
  getArrField('resultFiles'),
  getBoolField('completeAnalysis'),
  getStrField('museumNo'),
  getStrField('subNo'),
  getStrField('term'),
  getArrField('events', []),
  getStrField('analysisTypeCategory'),
  getStrField('updatedBy', null, false),
  getStrField('updatedByName', null, false),
  getStrField('updatedDate', null, false),
  getNumberField('status', 1, true, 1, 4, 0)
];

export default createForm('analysisForm.js', fieldsArray);
