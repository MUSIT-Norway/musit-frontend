// @flow
import React from 'react';
import type { Field } from 'forms/form';
import type { AppSession } from '../../types/appSession';
import identity from 'lodash/identity';

type FieldComboDropDownProps<T> = {
  field: Field<string>,
  defaultOption?: string,
  extractValue: (v: T, a: ?AppSession) => number | string,
  displayValue: (v: T, a: ?AppSession) => string,
  title: string,
  onChange: Function,
  selectItems: Array<T>,
  inputProps?: { className?: string, style?: {} },
  appSession?: AppSession
};

type FieldComboDropDownStrProps = {
  field: Field<string>,
  defaultOption?: string,
  title: string,
  onChange: Function,
  selectItems: Array<string>,
  inputProps?: { className?: string, style?: {} },
  appSession?: AppSession
};

export default function FieldComboDropDown<T>(props: FieldComboDropDownProps<T>) {
  return (
    <div>
      {props.title !== '' && (
        <label className="control-label col-md-2" htmlFor={props.field.name}>
          {props.title}
        </label>
      )}
      <div className="col-md-3">
        <input
          {...props.inputProps}
          className={`form-control ${props.inputProps
            ? props.inputProps.className || ''
            : ''}`}
          value={props.field.value || ''}
          id={props.field.name}
          onChange={e =>
            props.onChange({ name: props.field.name, rawValue: e.target.value })}
          list={`${props.field.name}-list`}
        />
        <datalist id={`${props.field.name}-list`}>
          {props.selectItems.map((v, i) => (
            <option key={i} value={props.extractValue(v, props.appSession)}>
              {props.displayValue(v, props.appSession)}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
}

/**
 * Wrapper function around FieldComboDropDown that handles pure string items
 */
export const FieldComboDropDownStr = (props: FieldComboDropDownStrProps) => {
  const extProps: FieldComboDropDownProps<string> = {
    ...props,
    displayValue: identity,
    extractValue: identity
  };
  return FieldComboDropDown(extProps);
};
