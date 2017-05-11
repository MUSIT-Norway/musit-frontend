// @flow
import type { Field } from '../../../forms/form';
import createForm from '../../../forms/form';
import { isNonEmptyArray, isRequired } from '../../../forms/validators';
import { stringMapper, booleanMapper, noMapper } from '../../../forms/mappers';

export const getStrField = (field: string, value: string = ''): Field<string> => ({
  name: field,
  defaultValue: value,
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

const analysisTypeName = getStrField('analysisTypeName');
const checked = getBoolField('checked');
const collections = getArrField('collections');

export const fieldsArray = [analysisTypeName, checked, collections];

export default createForm('analysisTypesForm.js', fieldsArray);
