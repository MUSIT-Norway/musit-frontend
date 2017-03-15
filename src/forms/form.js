/* @flow */
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import isEmpty from 'lodash/isEmpty';
import { stringMapper } from './mappers';
import { noValidation } from './validators';

export type Field<T> = {
  name: string,
  rawValue?: ?string,
  defaultValue?: ?T,
  value?: ?T,
  status?: {
    valid: boolean,
    error?: any
  },
  mapper: {
    fromRaw: (s: ?string) => ?T,
    toRaw: (t: ?T) => ?string
  },
  validator: {
    rawValidator?: (field: string) => (s: ?string) => ?string,
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
  const rawError = field.validator.rawValidator && field.validator.rawValidator(field.name)(rawValue);
  const value = field.mapper.fromRaw(rawValue);
  const valueError = !rawError && field.validator.valueValidator && field.validator.valueValidator(field.name)(value);
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

const updateForm = (state: Field<*>[], data: Update<*>): Field<*>[] => {
  const fieldIndex: number = state.findIndex((f: Field<*>) => f.name === data.name);
  if (fieldIndex === -1) {
    return state;
  }
  const updated = updateField(state[fieldIndex], data);
  return state.slice(0, fieldIndex).concat([updated]).concat(state.slice(fieldIndex + 1));
};

const reducer$ = (updateField$: Subject<Update<*>>, loadForm$: Subject<Update<*>[]>) => Observable.merge(
  loadForm$.map((load: Update<*>[]) => (state: Field<*>[]) => load.reduce(updateForm, state)),
  updateField$.map((update: Update<*>) => (state: Field<*>[]) => updateForm(state, update))
);

export type FormDetails = {
  updateForm$: Subject<Update<*>>,
  loadForm$: Subject<Update<*>[]>,
  form$: Observable<Field<*>[]>
};

const createForm$ = (
  name: string,
  fields: Field<*>[],
  updateForm$?: Subject<Update<*>>,
  loadForm$?: Subject<Update<*>[]>
): FormDetails => {
  updateForm$ = updateForm$ || createAction(name + ': updateForm$');
  loadForm$ = loadForm$ || createAction(name + ': loadForm$');
  const initialFields = fields.reduce((acc, field) => [...acc, {
    ...field,
    rawValue: field.mapper.toRaw(field.defaultValue),
    validator: field.validator || noValidation,
    mapper: field.mapper || stringMapper
  }], []);
  return {
    updateForm$,
    loadForm$,
    form$: createStore(name, reducer$(updateForm$, loadForm$), Observable.of(initialFields))
      .map(form => form.reduce((acc, f) => ({...acc, [f.name]: f}), {}))
  };
};

export default createForm$;