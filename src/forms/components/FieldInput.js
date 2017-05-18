// @flow
import React from 'react';
import type { Field } from 'forms/form';

type FieldInputProps = {
  field: Field<*>,
  title: string,
  onChange: Function,
  inputProps?: {
    className?: string,
    style?: {}
  }
};

export default function FieldInput(
  { field, title, onChange, inputProps }: FieldInputProps
) {
  return (
    <div>
      {title !== '' &&
        <label className="control-label col-md-2" htmlFor={field.name}>
          {title}
        </label>}
      <div className="col-md-3">
        <input
          {...inputProps}
          className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
          id={field.name}
          value={field.rawValue || ''}
          onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
        />
      </div>
    </div>
  );
}
