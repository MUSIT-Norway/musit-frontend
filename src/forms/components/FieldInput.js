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
  },
  readOnly?: boolean,
  labelWidth?: number,
  controlWidth?: number
};

export default function FieldInput({
  field,
  title,
  onChange,
  inputProps,
  readOnly = false,
  labelWidth = 2,
  controlWidth = 3
}: FieldInputProps) {
  return (
    <div>
      {title !== '' && (
        <label className={`control-label col-md-${labelWidth}`} htmlFor={field.name}>
          {title}
        </label>
      )}
      <div className={`col-md-${controlWidth}`}>
        {readOnly ? (
          <p className="form-control-static">{field.rawValue}</p>
        ) : (
          <input
            {...inputProps}
            className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
            id={field.name}
            value={field.rawValue || ''}
            onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
