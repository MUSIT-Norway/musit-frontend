// @flow
import * as React from 'react';
import { Field } from '../../forms/form';
import { AppSession } from '../../types/appSession';
import { Star } from '../../types/common';

export type ValueExtractor = (
  o: { id: number; noStatus: string; enStatus: string },
  a?: AppSession
) => string;

export interface FieldDropDownProps {
  field: Field<string>;
  defaultOption?: string;
  valueFn?: ValueExtractor;
  displayFn?: ValueExtractor;
  title: string;
  onChange: Function;
  selectItems: Array<Star>;
  inputProps?: { className?: string; style?: {} };
  appSession?: AppSession;
}

export default function FieldDropDown(props: FieldDropDownProps) {
  return (
    <div>
      {props.title !== '' && (
        <label className="control-label col-md-2" htmlFor={props.field.name}>
          {props.title}
        </label>
      )}
      <div className="col-md-3">
        <select
          {...props.inputProps}
          className={`form-control ${
            props.inputProps ? props.inputProps.className || '' : ''
          }`}
          value={props.field.value || ''}
          id={props.field.name}
          onChange={e =>
            props.onChange({ name: props.field.name, rawValue: e.target.value })
          }
        >
          {props.defaultOption && <option>{props.defaultOption}</option>}
          {props.selectItems.map((v: any, i) => (
            <option
              key={i}
              value={
                props.valueFn
                  ? props.appSession
                    ? props.valueFn(v, props.appSession)
                    : props.valueFn(v)
                  : v
              }
            >
              {props.displayFn
                ? props.appSession
                  ? props.displayFn(v, props.appSession)
                  : props.displayFn(v)
                : v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
