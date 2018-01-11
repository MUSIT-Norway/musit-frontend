//@flow
import React from 'react';
import type { AppSession } from '../../types/appSession';
import Select from 'react-select';

export type FieldMultiSelectProps = {
  stringValue?: any,
  options: ?Array<any>,
  title: ?string,
  titleSize?: string,
  onChange: Function,
  labelAbove?: boolean,
  inputProps?: { className?: string, style?: {} },
  appSession?: ?AppSession,
  viewMode?: ?boolean,
  singleSelect?: ?boolean
};

export default function FieldMultiSelect(props: FieldMultiSelectProps) {
  const name = props.name ? props.name : '';
  const values: ?string = props.stringValue ? props.stringValue : '';
  const options = props.options ? props.options : [];

  const label = opt => (opt ? opt.label : '');
  const filterOptions = v => options && options.filter(f => f.value === v);
  const viewOptions: ?Array<string> =
    values && options
      ? values
          .split(',')
          .map(v => (filterOptions(v).length > 0 ? label(filterOptions(v)[0]) : ''))
      : [];
  if (props.labelAbove) {
    return (
      <div className="row form-group">
        <div className="col-md-3">
          {props.title !== '' && (
            <label className={`control-label ${props.titleSize || ''}`} htmlFor={name}>
              {props.title}
            </label>
          )}
          {props.viewMode && (
            <div style={{ padding: '8px' }}>
              {' '}
              {viewOptions && viewOptions.join(', ')}{' '}
            </div>
          )}
          {!props.viewMode && (
            <Select
              {...props.inputProps}
              clearable={false}
              multi={!props.singleSelect}
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
            multi={!props.singleSelect}
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
