import React from 'react';
import type { Field } from 'forms/form';
import type { AppSession } from '../../types/appSession';
import Select from 'react-select';

type option = { id: number, noLabel: string, enLabel?: string };

export type FieldMultiSelectProps = {
  fields: Array<Field<string>>,
  options?: Array<option>,
  title: string,
  onChange: Function,
  inputProps?: { className?: string, style?: {} },
  appSession?: AppSession,
  viewMode?: boolean
};

export default function FieldMultiSelect(props: FieldMultiSelectProps) {
  const name = props.fields[0] ? props.fields[0].name : '_1';
  const values = props.fields ? props.fields.map(field => field.value) : [];
  const label = (opt: option) =>
    props.appSession && props.appSession.language.isEn && opt ? opt.enLabel : opt.noLabel;
  const options = props.options
    ? props.options.map(option => ({ value: option.id, label: label(option) }))
    : [];

  const filterOptions = v => props.options.filter(f => f.id == v);
  const viewOptions =
    values && options
      ? values.map(v => (
          <div> {filterOptions(v).length > 0 ? label(filterOptions(v)[0]) : ''}</div>
        ))
      : '';

  return (
    <div className="row form-group">
      {props.title !== '' && (
        <label className="control-label col-md-2" htmlFor={name}>
          {props.title}
        </label>
      )}
      <div className="col-md-3">
        {props.viewMode && viewOptions}
        {!props.viewMode && (
          <Select
            {...props.inputProps}
            clearable={false}
            multi
            closeOnSelect={false}
            removeSelected={true}
            simpleValue
            id={name}
            value={values}
            options={options}
            onChange={e => props.onChange(e ? e.split(',') : '')}
          />
        )}
      </div>
    </div>
  );
}
