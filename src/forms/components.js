// @flow
import React from 'react';
import type { DomEvent } from '../types/dom';

export type ElementProps = {
  id: string,
  label: string,
  labelWidth: number,
  elementWidth: number,
  children?: any,
  hasError?: boolean
};

export function FormElement(props: ElementProps) {
  return (
    <div className={`form-group ${props.hasError ? 'has-error' : ''}`}>
      <label className={`control-label col-md-${props.labelWidth}`} htmlFor={props.id}>
        {props.label}
      </label>
      <div className={`col-md-${props.elementWidth}`}>
        {props.children}
      </div>
    </div>
  );
}

export type InputProps = {
  value: ?string | ?Array<string | number>,
  onChange: (e: DomEvent) => void
} & ElementProps;

export function FormInput(props: InputProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <input
        type="text"
        className="form-control"
        id={props.id}
        value={props.value || ''}
        onChange={props.onChange}
      />
    </FormElement>
  );
}

export type TextProps = {
  value: ?string | ?Array<string | number>
} & ElementProps;

export function FormText(props: TextProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <p className="form-control-static" id={props.id}>{props.value}</p>
    </FormElement>
  );
}

export type TextAreaProps = {
  rows: number
} & InputProps;

export function FormTextArea(props: TextAreaProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <textarea
        className="form-control"
        rows={props.rows}
        id={props.id}
        value={props.value || ''}
        onChange={props.onChange}
      />
    </FormElement>
  );
}

export type SelectProps = {
  values: ?Array<*>,
  chooseLabel: string
} & InputProps;

export function FormSelect(props: SelectProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <select
        id={props.id}
        className="form-control"
        defaultValue={props.value || ''}
        onChange={props.onChange}
      >
        <option value="">{props.chooseLabel}</option>
        {props.values &&
          props.values.map(a => (
            <option key={a.id} value={a.id}>
              {a.value}
            </option>
          ))}
      </select>
    </FormElement>
  );
}

export function FormInputSelect(props: SelectProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <input
        id={props.id}
        list={`${props.id}-list`}
        type="text"
        className="form-control"
        value={props.value || ''}
        onChange={props.onChange}
        style={{ fontWeight: 'normal' }}
      />
      <datalist id={`${props.id}-list`}>
        {props.values && props.values.map((a, i) => <option key={i} value={a.value} />)}
      </datalist>
    </FormElement>
  );
}
