// @flow
import React from 'react';
import type { Field } from 'forms/form';

type FieldTextAreaProps = {
  field: Field<*>,
  title: string,
  onChangeInput: Function,
  inputProps?: {
    className?: string,
    style?: {},
    rows?: number
  }
};

export default function FieldTextArea({
  field,
  title,
  onChangeInput,
  inputProps
}: FieldTextAreaProps) {
  return (
    <div>
      {title !== '' &&
        <label className="control-label col-md-2" htmlFor={field.name}>
          {title}
        </label>}
      <div className="col-md-3">
        <textarea
          {...inputProps}
          className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
          id={field.name}
          value={field.rawValue || ''}
          onChange={e => onChangeInput({ name: field.name, rawValue: e.target.value })}
        />
      </div>
    </div>
  );
}
