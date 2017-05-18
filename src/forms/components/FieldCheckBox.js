// @flow
import React from 'react';
import type { Field } from 'forms/form';

type FieldInputProps = {
  field: Field<*>,
  title: string,
  yesValue: any,
  noValue: any,
  onChange: Function,
  inputProps?: {
    className?: string,
    style?: {}
  }
};

export default function CheckBoxInput(
  { field, yesValue = true, noValue = false, title, onChange }: FieldInputProps
) {
  return (
    <div>
      {title !== '' &&
        <label className="control-label col-md-2" htmlFor={field.name}>
          {title}
        </label>}
      <div className="col-md-3">
        <div className="btn-group" data-toggle="buttons">
          <label className={`btn btn-default${field.rawValue === '3' ? ' active' : ''}`}>
            <input
              type="radio"
              value={yesValue}
              checked={field.rawValue === yesValue}
              onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
            />
            {' '}
            Ja
          </label>
          <label className={`btn btn-default${field.rawValue === '2' ? ' active' : ''}`}>
            <input
              type="radio"
              value={noValue}
              checked={field.rawValue === noValue}
              onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
            />
            {' '}
            Nei
          </label>
        </div>
      </div>
    </div>
  );
}
