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

const updateField = (field: Field<*>, data: Update<*> | Load<*>): Field<*> => {
  const error = field.validator(data.value);
  return {
    ...field,
    value: data.value,
    origValue: data.origValue && data.origValue,
    status: {valid: !error, error}
  };
};

const updateForm = (state: Field<*>[], data: Update<*> | Load<*>): Field<*>[] => {
  const fieldIndex: number = state.findIndex((f: Field<*>) => f.name === data.name);
  if (fieldIndex === -1) {
    return state;
  }
  const updated = updateField(state[fieldIndex], data);
  return state.slice(0, fieldIndex).concat([updated]).concat(state.slice(fieldIndex + 1));
};

const reducer$ = (updateField$: Subject<Update<*>>, loadForm$: Subject<Load<*>[]>) => Observable.merge(
  loadForm$.map((load: Load<*>[]) => (state: Field<*>[]) => load.reduce(updateForm, state)),
  updateField$.map((update: Update<*>) => (state: Field<*>[]) => updateForm(state, update))
);

export type FormDetails = {
  updateField$: Subject<Update<*>>,
  loadForm$: Subject<Load<*>[]>,
  form$: Observable<Field<*>[]>
};

const createForm$ = (
  name: string,
  fields: Field<*>[],
  updateField$?: Subject<Update<*>>,
  loadForm$?: Subject<Load<*>[]>
): FormDetails => {
  updateField$ = updateField$ || createAction(name + ': updateField$');
  loadForm$ = loadForm$ || createAction(name + ': updateForm$');
  return {
    updateField$,
    loadForm$,
    form$: createStore(name, reducer$(updateField$, loadForm$), Observable.of(fields))
      .map(form => form.reduce((acc, f) => ({...acc, [f.name]: f}), {}))
  };
};

export default createForm$;