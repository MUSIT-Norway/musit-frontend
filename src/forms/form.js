/* @flow */
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export type Field<T> = {
  name: string,
  value?: T | null,
  origValue?: T | null,
  validator: Function,
  status?: {
    valid: boolean,
    error?: any
  }
};

export type Update<T> = {
  name: string,
  value: T | null
};

export type Load<T> = {
  name: string,
  value: T | null,
  origValue?: T | null
};

const load = (acc: Field<*>[], loadField: Load<*>) => {
  const field: ?Field<*> = acc.find((f: Field<*>) => f.name === loadField.name);
  if (!field) {
    return acc;
  }
  const error: any = field.validator(loadField.value);
  const updated: Field<*> = {
    ...field,
    value: loadField.value,
    origValue: loadField.origValue,
    status: {valid: !error, error}
  };
  return [
    ...acc.filter((f: Field<*>) => f.name !== field.name),
    updated
  ];
};

const update = (updateField: Update<*>) => (state: Field<*>[]) => {
  const field: ?Field<*> = state.find((f: Field<*>) => f.name === updateField.name);
  if (!field) {
    return state;
  }
  const error: any = field.validator(updateField.value);
  const updated: Field<*> = {
    ...field,
    value: updateField.value,
    status: {valid: !error, error}
  };
  return [
    ...state.filter((f: Field<*>) => f.name !== field.name),
    updated
  ];
};

const reducer$ = (updateField$: Subject<Update<*>>, loadForm$: Subject<Load<*>[]>) => Observable.merge(
  loadForm$.map((loadForm: Load<*>[]) => (state: Field<*>[]) => loadForm.reduce(load, state)),
  updateField$.map(update)
);

const createForm$ = (
  name: string,
  fields: Field<*>[],
  updateField$?: Subject<Update<*>>,
  loadForm$?: Subject<Load<*>[]>
) => {
  updateField$ = updateField$ || createAction(name + ': updateField$');
  loadForm$ = loadForm$ || createAction(name + ': updateForm$');
  return {
    updateField$,
    loadForm$,
    form$: createStore(name, reducer$(updateField$, loadForm$), Observable.of(fields))
  };
};

export default createForm$;