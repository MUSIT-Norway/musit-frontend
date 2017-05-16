import React from 'react';
import type { Field } from 'forms/form';

type FieldDropDownProps = {
  field: Field<string>,
  defaultOption?: string,
  title: any,
  onChange: Function,
  selectItems: Array<string>,
  inputProps?: { className?: string, style?: {} }
};

export default function FieldDropDown(
  { field, onChange, defaultOption, selectItems, inputProps, title }: FieldDropDownProps
) {
  return (
    <div>
      {title !== '' &&
        <label className="control-label col-md-2" htmlFor={field.name}>
          {title}
        </label>}
      <div className="col-md-3">
        <select
          {...inputProps}
          className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
          value={field.value || ''}
          id={field.name}
          onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
        >
          {defaultOption && <option>{defaultOption}</option>}
          {selectItems.map((v, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
