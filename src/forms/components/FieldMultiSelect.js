//@flow
import React from 'react';
import type { AppSession } from '../../types/appSession';
import Select from 'react-select';

export type FieldMultiSelectProps<T> = {
  stringValue?: string,
  name: string,
  options: Array<T>,
  title: string,
  onChange: Function,
  inputProps?: { className?: string, style?: {} },
  appSession?: AppSession,
  viewMode?: boolean,
  getLabel: T => string,
  filter: T => T => boolean
};

export default function FieldMultiSelect(props: *) {
  const name = props.name;
  const values = props.stringValue;
  const options = props.options;

  const label = opt => (opt ? opt.label : '');
  const filterOptions = v => options.filter(f => f.value == v);
  const viewOptions: ?Array<string> =
    values && options
      ? values
          .split(',')
          .map(v => (filterOptions(v).length > 0 ? label(filterOptions(v)[0]) : ''))
      : [];

  return (
    <div className="row form-group">
      {props.title !== '' && (
        <label className="control-label col-md-2" htmlFor={name}>
          {props.title}
        </label>
      )}
      <div className="col-md-3">
        {props.viewMode && (
          <div style={{ padding: '8px' }}> {viewOptions && viewOptions.join(', ')} </div>
        )}
        {!props.viewMode && (
          <Select
            {...props.inputProps}
            clearable={false}
            multi
            closeOnSelect={true}
            removeSelected={false}
            simpleValue
            id={name}
            value={values}
            options={options}
            onChange={v => props.onChange(v)}
          />
        )}
      </div>
    </div>
  );
}
