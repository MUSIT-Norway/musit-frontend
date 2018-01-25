// @flow
import createForm, {
  getStrField,
  getArrField,
  getNumberField,
  getBoolField
  // getCompositeField
} from '../../forms/form';
import { subEventValidator, actorsAndRolesValidator } from './shared/formValidators';

export const fieldsArray = [
  getStrField('id'),
  getNumberField('eventTypeId', null, false),
  getNumberField('editable', null, false),
  getNumberField('expandOnView', null, false),
  getStrField('editableValues', '', false),
  getArrField('actorsAndRoles', [], false, actorsAndRolesValidator),
  getStrField('registeredBy', null, false),
  getStrField('registeredByName', null, false),
  getStrField('registeredDate', null, false),
  getStrField('note'),
  getStrField('caseNumber'),
  getArrField('affectedThings', [], false),
  getArrField('objects', [], false),
  getStrField('updatedBy', null, false),
  getStrField('updatedByName', null, false),
  getStrField('updatedDate', null, false),
  getStrField('subEventTypes', '', false),
  getArrField('events', [], false, subEventValidator),
  getBoolField('objectsExpanded', false)
];

export default createForm('conservationForm.js', fieldsArray);
