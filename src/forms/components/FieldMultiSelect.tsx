//@flow
import * as React from 'react';
import { AppSession } from '../../types/appSession';
import Select from 'react-select';
import { I18n } from 'react-i18nify';
import { Maybe, TODO } from '../../types/common';
import { Collection } from '../../models/object/person';
import { collections, museum } from '../../modules/object/person/mockdata/data';

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
  values?: Collection[];
}

export default function FieldMultiSelect(props: FieldMultiSelectProps) {
  const placeholder = I18n.t('musit.texts.makeChoice');
  const name = props.name ? props.name : '';
  const values: Collection[] = props.values ? props.values : [];
  const options: Collection[] = props.options ? props.options : [];
  const viewOptions =
    values && options
      ? values.map((e: Collection, i: number) => ({
          label: `${museum[e.museum_id] && museum[e.museum_id].abbreviation} -
                            ${(collections[e.collection_id] &&
                              collections[e.collection_id].collectionName) ||
                              ''}`,
          value: i
        }))
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
              clearable={true}
              multi={!props.singleSelect}
              closeOnSelect={true}
              removeSelected={false}
              simpleValue
              id={name}
              value={viewOptions}
              options={options}
              onChange={(v: TODO) => props.onChange(v)}
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
            value={viewOptions}
            options={options}
            onChange={(v: TODO) => props.onChange(v)}
          />
        )}
      </div>
    </div>
  );
}
