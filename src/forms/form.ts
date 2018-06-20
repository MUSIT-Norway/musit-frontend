// @flow
import { Observable, Subject } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { isEmpty } from 'lodash';
import { stringMapper, noMapper, booleanMapper, numberMapper } from './mappers';
import {
  noValidation,
  isRequired,
  isNonEmptyArray,
  isNumberInRange,
  isNumber,
  composeValidators
} from './validators';
import { KEEP_ALIVE } from '../stores/constants';
import { Maybe, RemoveMaybe, Star, TODO, MUSTFIX } from '../types/common';

export type ValueType = string | number | boolean | Array<Star>;
export type RawValue = ValueType | { [key: string]: ValueType };

export type Field<T> = {
  name: string;
  rawValue?: Maybe<RawValue>;
  defaultValue: Maybe<T>;
  value?: Maybe<T>;
  status?: {
    valid: boolean;
    error?: Maybe<string>;
  };
  mapper: {
    fromRaw: (s: Maybe<RawValue>) => Maybe<T>;
    toRaw: (t: Maybe<T>) => Maybe<RawValue>;
  };
  validator: {
    rawValidator?: RemoveMaybe<(field: string) => (s: Maybe<RawValue>) => Maybe<string>>;
    valueValidator?: RemoveMaybe<(field: string) => (t: Maybe<T>) => Maybe<string>>;
  };
};

export type Update<T> = {
  name: string;
  rawValue: Maybe<string>;
  defaultValue?: Maybe<T>;
};

const updateField = (field: Field<Star>, data: Update<Star>): Field<Star> => {
  const defaultValue = data.defaultValue || field.defaultValue;
  const rawValue =
    typeof data.rawValue !== 'undefined'
      ? data.rawValue
      : field.mapper.toRaw(defaultValue);
  const rawError =
    field.validator.rawValidator && field.validator.rawValidator(field.name)(rawValue);
  const value = field.mapper.fromRaw(rawValue);
  const valueError =
    !rawError &&
    field.validator.valueValidator &&
    field.validator.valueValidator(field.name)(value);
  const error = rawError || valueError || null;
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
  defaultValue: Maybe<string> = null,
  required: boolean = false
): Field<string> => ({
  name: field,
  defaultValue: defaultValue,
  value: defaultValue,
  rawValue: stringMapper.toRaw(defaultValue),
  mapper: stringMapper,
  validator: {
    rawValidator: required ? isRequired : null
  }
});

export function getCompositeField<T>(field: string, defaultValue?: Maybe<T>): Field<T> {
  return {
    name: field,
    defaultValue: defaultValue,
    value: defaultValue,
    rawValue: noMapper.toRaw(defaultValue),
    mapper: noMapper,
    validator: {}
  };
}

export const getBoolField = (
  field: string,
  defaultValue: Maybe<boolean> = null
): Field<boolean> => ({
  name: field,
  defaultValue: defaultValue,
  value: defaultValue,
  rawValue: booleanMapper.toRaw(defaultValue),
  mapper: booleanMapper,
  validator: {}
});

export const getArrField = (
  field: string,
  defaultValue: Array<Star> = [],
  required: boolean = false,
  customValidator?: Function
): Field<Array<Star>> => ({
  name: field,
  defaultValue: defaultValue,
  value: defaultValue,
  rawValue: defaultValue,
  mapper: noMapper,
  validator: {
    rawValidator: required
      ? customValidator
        ? (composeValidators(isNonEmptyArray, customValidator as TODO) as TODO)
        : isNonEmptyArray
      : customValidator
  }
});

//TODO: Behøver vi Maybe på parametrene som har default verdi? Det var slik (og mer til) i den opprinnelige flow-kodingen...
//(Men det var ikke konsistent med seg selv, isNumber og isNumberInRange forventer number, ikke number|null|undefined o.l.)

export const getNumberField = (
  field: string,
  defaultValue: Maybe<number> = null, //Kan være strengere her og sette number | null, undefined blir vel umulig ettersom vi har default verdi?
  required: boolean = false,
  rangeFrom: number = 0,
  rangeTo = Number.MAX_VALUE,
  decimalPrecision: number = 2
): Field<number> => ({
  name: field,
  defaultValue: defaultValue,
  value: defaultValue,
  rawValue: numberMapper.toRaw(defaultValue),
  mapper: numberMapper,
  validator: {
    rawValidator: required
      ? composeValidators(isRequired, isNumber(0, decimalPrecision))
      : null,
    valueValidator: isNumberInRange(rangeFrom, rangeTo)
  }
});

const updateForm = (state: Field<Star>[], data: Update<Star>): Field<Star>[] => {
  const fieldIndex: number = state.findIndex((f: Field<Star>) => f.name === data.name);
  if (fieldIndex === -1) {
    return state;
  }
  const updated = updateField(state[fieldIndex], data);
  return state
    .slice(0, fieldIndex)
    .concat([updated])
    .concat(state.slice(fieldIndex + 1));
};

const reducer$ = (initialFields: TODO, { updateForm$, loadForm$, clearForm$ }: TODO) => {
  return Observable.merge(
    clearForm$.map(() => () => initialFields),
    loadForm$.map((load: Update<Star>[]) => (state: Field<Star>[]) =>
      load.reduce(updateForm, state)
    ),
    updateForm$.map((update: Update<Star>) => (state: Field<Star>[]) =>
      updateForm(state, update)
    )
  );
};

export type FormDetails = {
  updateForm$: Subject<Update<Star>>;
  loadForm$: Subject<Array<Update<Star>>>;
  clearForm$: Subject<void>;
  form$: Observable<{ [key: string]: Field<Star> }>;
};

/**
 * This methods generates an object containing the form observable and update/load subjects.
 * Its used like this:
 * form.js:
 * {
 *   const fields = [ getNumberField('id'), getStrField('name') ];
 *   export default createForm$('personForm', fields);
 * }
 * page.js:
 * {
 *   import personForm from './form.js';
 *   const { form$, updateForm$, loadForm$ } = personForm;
 *   ....
 *   export default inject({ form$ }, { updateForm$, loadForm$ })(Page);
 * }
 * @param name The name of the form, should be some what unique
 * @param fields The array of fields that should back this form
 * @param updateForm$ The custom update subject, can be left undefined (will be auto generated if undefined)
 * @param loadForm$ The custom load subject, can be left undefined (will be auto generated if undefined)
 * @returns {{updateForm$: Subject.<Update.<*>>, loadForm$: Subject.<Array.<Update.<*>>>, form$}}
 */
const createForm$ = (
  name: string,
  fields: Array<Field<Star>>,
  updateForm$?: Subject<Update<Star>>,
  loadForm$?: Subject<Array<Update<Star>>>
): FormDetails => {
  updateForm$ = updateForm$ || createAction(name + ': updateForm$');
  loadForm$ = loadForm$ || createAction(name + ': loadForm$');
  const clearForm$ = createAction<void>(name + ': clearForm$');
  const initialFields: Array<Field<Star>> = fields.reduce(
    (acc, field) => [
      ...acc,
      updateField(
        {
          ...field,
          rawValue: field.mapper.toRaw(field.defaultValue),
          validator: field.validator || noValidation,
          mapper: field.mapper || stringMapper
        },
        { name: field.name, rawValue: field.rawValue as any }
      )
    ],
    [] as Array<MUSTFIX>
  );
  return {
    updateForm$,
    loadForm$,
    clearForm$,
    form$: createStore(
      name,
      reducer$(initialFields, { updateForm$, loadForm$, clearForm$ }) as MUSTFIX,
      initialFields,
      KEEP_ALIVE
    ).map(form => form.reduce((acc, f) => ({ ...acc, [f.name]: f }), {}))
  };
};

export default createForm$;
