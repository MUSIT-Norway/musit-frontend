//@flow
import * as React from 'react';
import { AppSession } from '../../types/appSession';
import Select from 'react-select';
import { I18n } from 'react-i18nify';
import { Maybe, TODO } from '../../types/common';

export interface FieldMultiSelectProps {
  stringValue?: any;
  options: Maybe<Array<any>>;
  title: Maybe<string>;
  titleSize?: string;
  onChange: Function;
  labelAbove?: boolean;
  inputProps?: { className?: string; style?: {} };
  appSession?: Maybe<AppSession>;
  viewMode?: Maybe<boolean>;
  singleSelect?: Maybe<boolean>;
  style?: any;
  name?: string; //TODO: Jeg måtte legge til denne, sjekk om den brukes noe sted, hvis ikke bør den (og bruken av den nedenfor) fjenres
}

export default function FieldMultiSelect(props: FieldMultiSelectProps) {
  const placeholder = I18n.t('musit.texts.makeChoice');
  const name = props.name ? props.name : '';
  const values: Maybe<string> = props.stringValue ? props.stringValue : '';
  const options = props.options ? props.options : [];

  const label = (opt: TODO) => (opt ? opt.label : '');
  const filterOptions = (v: TODO) => options && options.filter(f => f.value === v);
  const viewOptions: Maybe<Array<string>> =
    values && options
      ? values
          .split(',')
          .map(v => (filterOptions(v).length > 0 ? label(filterOptions(v)[0]) : ''))
      : [];
  if (props.labelAbove) {
    return (
      <div className="row form-group">
        <div className="col-md-4">
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
              placeholder={placeholder}
              clearable={false}
              multi={!props.singleSelect}
              closeOnSelect={true}
              removeSelected={false}
              simpleValue
              id={name}
              value={values as TODO}
              options={options}
              onChange={v => props.onChange(v)}
              style={props.style}
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
            placeholder={placeholder}
            clearable={false}
            multi={!props.singleSelect}
            closeOnSelect={true}
            removeSelected={false}
            simpleValue
            id={name}
            value={values as TODO}
            options={options}
            onChange={v => props.onChange(v)}
          />
        )}
      </div>
    </div>
  );
}
