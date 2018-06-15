// @flow
import { Observable, Subject } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
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
import { KEEP_ALIVE } from '../stores/constants';

export type ValueType = string | number | boolean | Array<*>;
export type RawValue = ValueType | { [string]: ValueType };

export type Field<T> = {
  name: string,
  rawValue?: ?RawValue,
  defaultValue: ?T,
  value?: ?T,
  status?: {
    valid: boolean,
    error?: ?string
  },
  mapper: {
    fromRaw: (s: ?RawValue) => ?T,
    toRaw: (t: ?T) => ?RawValue
  },
  validator: {
    rawValidator?: ?(field: string) => (s: ?RawValue) => ?string,
    valueValidator?: ?(field: string) => (t: ?T) => ?string
  }
};

export type Update<T> = {
  name: string,
  rawValue: ?string,
  defaultValue?: ?T
};

const updateField = (field: Field<*>, data: Update<*>): Field<*> => {
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
  defaultValue?: ?string = null,
  required?: boolean = false
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

export function getCompositeField<T>(field: string, defaultValue?: ?T): Field<T> {
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
  defaultValue?: ?boolean = null
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
  defaultValue?: Array<*> = [],
  required?: boolean = false,
  customValidator?: Function
): Field<Array<*>> => ({
  name: field,
  defaultValue: defaultValue,
  value: defaultValue,
  rawValue: defaultValue,
  mapper: noMapper,
  validator: {
    rawValidator: required
      ? customValidator
        ? composeValidators(isNonEmptyArray, customValidator)
        : isNonEmptyArray
      : customValidator
  }
});

export const getNumberField = (
  field: string,
  defaultValue?: ?number = null,
  required?: boolean = false,
  rangeFrom?: ?number = 0,
  rangeTo?: ?number = Number.MAX_VALUE,
  decimalPrecision?: ?number = 2
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

const updateForm = (state: Field<*>[], data: Update<*>): Field<*>[] => {
  const fieldIndex: number = state.findIndex((f: Field<*>) => f.name === data.name);
  if (fieldIndex === -1) {
    return state;
  }
  const updated = updateField(state[fieldIndex], data);
  return state
    .slice(0, fieldIndex)
    .concat([updated])
    .concat(state.slice(fieldIndex + 1));
};

const reducer$ = (initialFields, { updateForm$, loadForm$, clearForm$ }) => {
  return Observable.merge(
    clearForm$.map(() => () => initialFields),
    loadForm$.map((load: Update<*>[]) => (state: Field<*>[]) =>
      load.reduce(updateForm, state)
    ),
    updateForm$.map((update: Update<*>) => (state: Field<*>[]) =>
      updateForm(state, update)
    )
  );
};

export type FormDetails = {
  updateForm$: Subject<Update<*>>,
  loadForm$: Subject<Array<Update<*>>>,
  clearForm$: Subject<void>,
  form$: Observable<{ [string]: Field<*> }>
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
  fields: Array<Field<*>>,
  updateForm$?: Subject<Update<*>>,
  loadForm$?: Subject<Array<Update<*>>>
): FormDetails => {
  updateForm$ = updateForm$ || createAction(name + ': updateForm$');
  loadForm$ = loadForm$ || createAction(name + ': loadForm$');
  const clearForm$ = createAction(name + ': clearForm$');
  const initialFields: Array<Field<*>> = fields.reduce(
    (acc, field) => [
      ...acc,
      updateField(
        {
          ...field,
          rawValue: field.mapper.toRaw(field.defaultValue),
          validator: field.validator || noValidation,
          mapper: field.mapper || stringMapper
        },
        { name: field.name, rawValue: (field.rawValue: any) }
      )
    ],
    []
  );
  return {
    updateForm$,
    loadForm$,
    clearForm$,
    form$: createStore(
      name,
      reducer$(initialFields, { updateForm$, loadForm$, clearForm$ }),
      initialFields,
      KEEP_ALIVE
    ).map(form => form.reduce((acc, f) => ({ ...acc, [f.name]: f }), {}))
  };
};

export default createForm$;
