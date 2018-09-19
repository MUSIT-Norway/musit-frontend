//@flow
import * as React from 'react';
import { AppSession } from '../../../types/appSession';
import Select from 'react-select';
import { I18n } from 'react-i18nify';
import { Maybe, TODO } from '../../../types/common';

export interface FieldMultiSelectProps {
  /* I added an id property because we need something to locate this component during tests.
Note that you should not have the same 'id' and 'name', because the 'name' ends up as an id on 
an inner input field during rendering of the component, so conflicts can arise if you use
the same value for both 'id' and 'name'.
*/

  id?: string;
  title: Maybe<string>;
  titleSize?: string;
  labelAbove?: boolean;
  inputProps?: { className?: string; style?: {} };
  appSession?: Maybe<AppSession>;
  viewMode?: boolean;
  singleSelect?: boolean;
  style?: any;
  name?: string; //TODO: Jeg måtte legge til denne, sjekk om den brukes noe sted, hvis ikke bør den (og bruken av den nedenfor) fjenres
  matchProp?: string; // Possible values ("label", "value" or "any")
  removeSelected: boolean;
  closeOnSelect: boolean;
  options: FieldMultiOptValues[];
  values?: string[];
  onChange: Function;
}

export type FieldMultiOptValues = {
  label: string;
  value: string;
};

export default function FieldMultiSelect(props: FieldMultiSelectProps) {
  const placeholder = I18n.t('musit.texts.makeChoice');
  const name = props.name ? props.name : '';
  const values: string[] = props.values ? props.values : [];
  const options: FieldMultiOptValues[] = props.options ? props.options : [];

  if (props.labelAbove) {
    return (
      <div className="row form-group">
        <div className="col-md-4" id={props.id}>
          {props.title !== '' && (
            <label className={`control-label ${props.titleSize || ''}`} htmlFor={name}>
              {props.title}
            </label>
          )}
          <Select
            {...props.inputProps}
            placeholder={placeholder}
            clearable={false}
            multi={!props.singleSelect}
            closeOnSelect={props.closeOnSelect}
            removeSelected={props.removeSelected}
            id={name}
            value={values}
            options={options}
            matchProp={props.matchProp}
            filterOptions={props.matchProp}
            onChange={(v: TODO) => props.onChange(v)}
            style={props.style}
            disabled={props.viewMode}
          />
        </div>
      </div>
    );
  }
  // note: (ANURADHA: 10-Sep-2018) Below return not executed for person pages. It will need to complete with future
  // developments, when not using a label above.
  return (
    <div className="row form-group">
      {props.title !== '' && (
        <label className="control-label col-md-2" htmlFor={name}>
          {props.title}
        </label>
      )}
      <div className="col-md-3">
        {!props.viewMode && (
          <div style={{ padding: '8px' }}> {values && values.join(', ')} </div>
        )}
        {props.viewMode && (
          <Select
            {...props.inputProps}
            placeholder={placeholder}
            clearable={false}
            multi={!props.singleSelect}
            closeOnSelect={true}
            removeSelected={props.removeSelected}
            id={name}
            value={values}
            options={options}
            onChange={(v: TODO) => props.onChange(v)}
            disabled={props.viewMode}
          />
        )}
      </div>
    </div>
  );
}
