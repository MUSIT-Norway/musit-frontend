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

const reducer$: Observable<Field<*>[]> = (update$: Subject<Update<*>>) =>
  update$.map((update: Update<*>) => (state: Field<*>[]) => {
    const field: ?Field<*> = state.find((f: Field<*>) => f.name === update.name);
    if (!field) {
      return state;
    }
    const error: any = field.validator(update.value);
    const updated: Field<*> = {
      ...field,
      value: update.value,
      status: { valid: !error, error }
    };
    return [
      ...state.filter((f: Field<*>) => f.name !== field.name),
      updated
    ];
  });

const createForm$ = (
  name: string,
  fields: Field<*>[],
  updateField$?: Subject<Update<*>>
) => ({
  updateField$: updateField$ || createAction(name + ': updateField$'),
  form$: createStore(name, reducer$(updateField$), Observable.of(fields))
});

export default createForm$;