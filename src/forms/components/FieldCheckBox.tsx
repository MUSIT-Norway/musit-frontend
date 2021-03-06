// @flow
import * as React from 'react';
import { Field } from '../form';
import { I18n } from 'react-i18nify';
import { Star } from '../../types/common';

type FieldInputProps = {
  field: Field<Star>;
  title: string;
  yesValue: string | number;
  noValue: string | number;
  onChange: Function;
  inputProps?: {
    className?: string;
    style?: {};
  };
};

export default function CheckBoxInput({
  field,
  yesValue,
  noValue,
  title,
  onChange
}: FieldInputProps) {
  return (
    <div>
      {title !== '' && (
        <label className="control-label col-md-2" htmlFor={field.name}>
          {title}
        </label>
      )}
      <div className="col-md-3">
        <div className="btn-group" data-toggle="buttons">
          <label className={`btn btn-default${field.rawValue === '3' ? ' active' : ''}`}>
            <input
              type="radio"
              value={yesValue}
              checked={field.rawValue === yesValue}
              onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
            />{' '}
            {I18n.t('musit.texts.yes')}
          </label>
          <label className={`btn btn-default${field.rawValue === '2' ? ' active' : ''}`}>
            <input
              type="radio"
              value={noValue}
              checked={field.rawValue === noValue}
              onChange={e => onChange({ name: field.name, rawValue: e.target.value })}
            />{' '}
            {I18n.t('musit.texts.no')}
          </label>
        </div>
      </div>
    </div>
  );
}
