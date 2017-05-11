// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import isEmpty from 'lodash/isEmpty';
import { stringMapper, noMapper, booleanMapper, numberMapper } from './mappers';
import {
  noValidation,
  isRequired,
  isNonEmptyArray,
  isNumberInRange,
  isNumber,
  composeValidators
} from './validators';

export type RawValue = string | number | Array<*>;

export type Field<T> = {
  name: string,
  rawValue?: ?RawValue,
  defaultValue: ?T,
  value?: ?T,
  status?: {
    valid: boolean,
    error?: any
  },
  mapper: {
    fromRaw: (s: ?RawValue) => ?T,
    toRaw: (t: ?T) => ?RawValue
  },
  validator: {
    rawValidator?: (field: string) => (s: ?RawValue) => ?string,
    valueValidator?: (field: string) => (t: ?T) => ?string
  }
};

export type Update<T> = {
  name: string,
  rawValue: ?string,
  defaultValue?: ?T
};

const updateField = (field: Field<*>, data: Update<*>): Field<*> => {
  const defaultValue = data.defaultValue || field.defaultValue;
  const rawValue = data.rawValue || field.mapper.toRaw(defaultValue);
  const rawError = field.validator.rawValidator &&
    field.validator.rawValidator(field.name)(rawValue);
  const value = field.mapper.fromRaw(rawValue);
  const valueError = !rawError &&
    field.validator.valueValidator &&
    field.validator.valueValidator(field.name)(value);
  const error = rawError || valueError;
  return {
    ...field,
    rawValue,
    value,
    defaultValue,
    status: {
      valid: isEmpty(error),
      error
    }
  };
};

export const getStrField = (
  field: string,
  defaultValue?: ?string = null
): Field<string> => ({
  name: field,
  defaultValue: defaultValue,
  mapper: stringMapper,
  validator: {
    rawValidator: isRequired
  }
});

export const getBoolField = (
  field: string,
  defaultValue?: ?boolean = null
): Field<boolean> => ({
  name: field,
  defaultValue: defaultValue,
  mapper: booleanMapper,
  validator: {}
});

export const getArrField = (
  field: string,
  defaultValue?: Array<*> = []
): Field<Array<*>> => ({
  name: field,
  defaultValue: defaultValue,
  mapper: noMapper,
  validator: {
    rawValidator: isNonEmptyArray
  }
});

export const getNumberField = (
  field: string,
  defaultValue?: ?number = null,
  rangeFrom?: ?number = 0,
  rangeTo?: ?number = Number.MAX_VALUE,
  decimalPrecision?: ?number = 2
): Field<number> => ({
  name: field,
  defaultValue: defaultValue,
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isNumber(0, decimalPrecision)),
    valueValidator: isNumberInRange(rangeFrom, rangeTo)
  }
});

const updateForm = (state: Field<*>[], data: Update<*>): Field<*>[] => {
  const fieldIndex: number = state.findIndex((f: Field<*>) => f.name === data.name);
  if (fieldIndex === -1) {
    return state;
  }
  const updated = updateField(state[fieldIndex], data);
  return state.slice(0, fieldIndex).concat([updated]).concat(state.slice(fieldIndex + 1));
};

const reducer$ = (updateField$: Subject<Update<*>>, loadForm$: Subject<Update<*>[]>) =>
  Observable.merge(
    loadForm$.map((load: Update<*>[]) =>
      (state: Field<*>[]) => load.reduce(updateForm, state)),
    updateField$.map((update: Update<*>) =>
      (state: Field<*>[]) => updateForm(state, update))
  );

export type FormDetails = {
  updateForm$: Subject<Update<*>>,
  loadForm$: Subject<Update<*>[]>,
  form$: Observable<Field<*>[]>
};

const createForm$ = (
  name: string,
  fields: Array<Field<*>>,
  updateForm$?: Subject<Update<*>>,
  loadForm$?: Subject<Array<Update<*>>>
): FormDetails => {
  updateForm$ = updateForm$ || createAction(name + ': updateForm$');
  loadForm$ = loadForm$ || createAction(name + ': loadForm$');
  const initialFields = fields.reduce(
    (acc, field) => [
      ...acc,
      {
        ...field,
        rawValue: field.mapper.toRaw(field.defaultValue),
        validator: field.validator || noValidation,
        mapper: field.mapper || stringMapper
      }
    ],
    []
  );
  return {
    updateForm$,
    loadForm$,
    form$: createStore(
      name,
      reducer$(updateForm$, loadForm$),
      Observable.of(initialFields)
    ).map(form => form.reduce((acc, f) => ({ ...acc, [f.name]: f }), {}))
  };
};

export default createForm$;
