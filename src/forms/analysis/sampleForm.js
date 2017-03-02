/* @flow */
import type { Field } from '../form';

const isDefined = (value: any) => value !== null && typeof value !== 'undefined';

const hid: Field<string> = {
  name: 'hid',
  validator: isDefined
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  validator: isDefined
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  validator: isDefined
};

const sampleForm: Array<Field<any>> = [
  hid,
  registeredBy,
  registeredDate
];

export default sampleForm;