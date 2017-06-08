// @flow
import createForm, {
  getStrField,
  getArrField,
  getBoolField,
  getNumberField
} from '../../forms/form';

export const fieldsArray = [
  getStrField('id'),
  getNumberField('analysisTypeId'),
  getStrField('doneBy'),
  getStrField('doneDate'),
  getArrField('persons'),
  getStrField('registeredBy', null, false),
  getStrField('registeredByName', null, false),
  getStrField('registeredDate', null, false),
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
  getStrField('restrictions_requesterName', null, false),
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
  getStrField('updatedBy', null, false),
  getStrField('updatedByName', null, false),
  getStrField('updatedDate', null, false),
  getNumberField('status', 1, true, 1, 4, 0)
];

export default createForm('analysisForm.js', fieldsArray);
