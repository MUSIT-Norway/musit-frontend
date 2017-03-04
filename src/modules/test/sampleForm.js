/* @flow */
import type { Field } from '../../forms/form';
import type { FormDetails } from '../../forms/form';
import createForm from '../../forms/form';

const minLength = (length: number) => (value: string) => {
  const valid = value.length >= length;
  if (!valid) {
    return 'Minimum three characters required';
  }
};

const minimumThreeChars = minLength(3);

const isDefined = (value: any) => {
  const valid = value !== null && typeof value !== 'undefined';
  if (!valid) {
    return 'Required';
  }
};

const hid: Field<string> = {
  name: 'hid',
  validator: minimumThreeChars
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  validator: isDefined
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  validator: isDefined
};

const sampleForm: FormDetails = createForm('sampleForm', [
  hid,
  registeredBy,
  registeredDate
]);

export default sampleForm;
