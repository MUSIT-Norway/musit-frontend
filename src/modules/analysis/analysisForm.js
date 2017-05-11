// @flow
import createForm, {
  getStrField,
  getArrField,
  getBoolField,
  getNumberField
} from '../../forms/form';

export const fieldsArray = [
  getNumberField('id'),
  getStrField('analysisTypeId'),
  getStrField('doneBy'),
  getStrField('doneDate'),
  getStrField('registeredBy'),
  getStrField('registeredByName'),
  getStrField('registeredDate'),
  getStrField('responsible'),
  getStrField('responsible'),
  getStrField('administrator'),
  getStrField('completedBy'),
  getStrField('completedDate'),
  getStrField('objectId'),
  getStrField('note'),
  getStrField('type'),
  getStrField('partOf'),
  getStrField('result'),
  getStrField('place'),
  getStrField('reason'),
  getStrField('externalSource'),
  getStrField('comments'),
  getBoolField('restrictions', false),
  getStrField('restrictions_requester'),
  getStrField('restrictions_expirationDate'),
  getStrField('restrictions_reason'),
  getStrField('restrictions_cancelledReason'),
  getArrField('restrictions_caseNumbers'),
  getArrField('caseNumbers'),
  getBoolField('completeAnalysis'),
  getStrField('museumNo'),
  getStrField('subNo'),
  getStrField('term'),
  getArrField('events', []),
  getStrField('analysisTypeCategory'),
  getStrField('updatedBy'),
  getStrField('updatedByName'),
  getStrField('updatedDate'),
  getNumberField('status', 1, 1, 4, 0)
];

export default createForm('analysisForm.js', fieldsArray);
