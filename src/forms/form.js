/* @flow */
import { Observable } from 'rxjs';
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

const updateForm$: Observable<Update<any>> = createAction('updateForm$');

const reducer$: Observable<Field<any>[]> = updateForm$.map((update: Update<any>, state: Field<any>[]) => {
  const field: ?Field<any> = state.find((f: Field<any>) => f.name === update.name);
  if (!field) {
    return state;
  }
  const error: any = field.validator.call(update.value);
  const updated: Field<any> = {
    ...field,
    value: update.value,
    status: { valid: !error, error }
  };
  return state.filter((f: Field<any>) => f.name !== field.name).push(updated);
});

const createForm$ = (name: string = 'defaultForm', fields: Field<any>[]) => createStore(name, reducer$, fields);

export default createForm$;