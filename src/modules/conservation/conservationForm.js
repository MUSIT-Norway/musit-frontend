// @flow
import createForm, {
  getStrField,
  getArrField,
  getNumberField
  // getCompositeField
} from '../../forms/form';
import { subEventValidator, actorsAndRolesValidator } from './shared/formValidators';

export const fieldsArray = [
  getStrField('id'),
  getNumberField('eventTypeId', null, false),
  getStrField('doneBy'),
  getStrField('doneDate'),
  getArrField('actorsAndRoles', [], false, actorsAndRolesValidator),
  getStrField('participating'),
  getStrField('participatingName', null, false),
  getArrField('persons', [], false),
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
  getArrField('events', [], false, subEventValidator)
];

export default createForm('conservationForm.js', fieldsArray);
