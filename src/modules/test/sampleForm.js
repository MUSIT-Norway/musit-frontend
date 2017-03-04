import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import { composeValidators, isRequired, isNumeric, isAlphaNumeric } from 'revalidate';

const hid: Field<string> = { name: 'hid', validator: composeValidators(isRequired, isNumeric)('hid') };
const registeredBy: Field<string> = { name: 'registeredBy', validator: composeValidators(isRequired, isAlphaNumeric)('registeredBy') };
const registeredDate: Field<string> = { name: 'registeredDate', validator: composeValidators(isRequired)('registeredDate')};

export default createForm('sampleForm', [ hid, registeredBy, registeredDate ]);
