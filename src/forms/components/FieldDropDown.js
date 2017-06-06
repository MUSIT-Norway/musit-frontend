// @flow
import React from 'react';
import type { Field } from 'forms/form';

type FieldDropDownProps = {
  field: Field<string>,
  defaultOption?: string,
  valueFn?: Function,
  displayFn?: Function,
  title: string,
  onChange: Function,
  selectItems: Array<*>,
  inputProps?: { className?: string, style?: {} }
};

export default function FieldDropDown(props: FieldDropDownProps) {
  return (
    <div>
      {props.title !== '' &&
        <label className="control-label col-md-2" htmlFor={props.field.name}>
          {props.title}
        </label>}
      <div className="col-md-3">
        <select
          {...props.inputProps}
          className={`form-control ${props.inputProps ? props.inputProps.className || '' : ''}`}
          value={props.field.value || ''}
          id={props.field.name}
          onChange={e =>
            props.onChange({ name: props.field.name, rawValue: e.target.value })}
        >
          {props.defaultOption && <option>{props.defaultOption}</option>}
          {props.selectItems.map((v, i) => (
            <option key={i} value={props.valueFn ? props.valueFn(v) : v}>
              {props.displayFn ? props.displayFn(v) : v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
