// @flow
import * as React from 'react';
import { DomEvent } from '../types/dom';
import { Maybe, eventTargetFiles, Star, TODO } from '../types/common';


export type ElementProps = {
  id: string,
  label: string,
  labelWidth?: number,
  labelSize?: string,
  labelAbove?: boolean,
  elementWidth: number,
  children?: React.ReactNode,
  hasError?: boolean,
  style?: Object
};

export function FormElement(props: ElementProps) {
  if (!props.labelAbove && props.labelWidth) {
    return (
      <div className={`form-group ${props.hasError ? 'has-error' : ''}`}>
        <label
          className={`control-label ${props.labelSize || ''} col-md-${props.labelWidth}`}
          htmlFor={props.id}
        >
          {props.label}
        </label>
        <div className={`col-md-${props.elementWidth}`}>{props.children}</div>
      </div>
    );
  }
  return (
    <div className={`form-group ${props.hasError ? 'has-error' : ''}`}>
      <div className={`col-md-${props.elementWidth}`}>
        <label className={`control-label ${props.labelSize || ''}`} htmlFor={props.id}>
          {props.label}
        </label>
        {props.children}
      </div>
    </div>
  );
}

export type InputProps = {
  value: Maybe<string> | Maybe<Array<string> | number>,
  onChange: (e: DomEvent) => void
} & ElementProps;

export function FormInput(props: InputProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelSize={props.labelSize}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
      labelAbove={props.labelAbove}
      hasError={props.hasError}
    >
      <input
        type="text"
        className="form-control"
        id={props.id}
        value={props.value || ''}
        onChange={props.onChange}
        style={props.style}
      />
    </FormElement>
  );
}

export type FileSelect = {
  value: Maybe<Array<File>>,
  onChange: (files: Array<File>) => void,
  multiple?: boolean
} & ElementProps;

export function FormFileSelect(props: FileSelect) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelSize={props.labelSize}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
      labelAbove={props.labelAbove}
    >
      <input
        type="file"
        multiple={props.multiple}
        className="form-control"
        id={props.id}
        onChange={e => {
          const files = [...eventTargetFiles(e)];
          return props.onChange(files);
        }}
      />
    </FormElement>
  );
}

export type TextProps = {
  value: Maybe<string> | Maybe<Array<string> | number>
} & ElementProps;

export function FormText(props: TextProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelSize={props.labelSize}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <p className="form-control-static" id={props.id}>
        {props.value}
      </p>
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
      labelSize={props.labelSize}
      labelAbove={props.labelAbove}
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
  values: Maybe<Array<Star>>,
  chooseLabel: string
} & InputProps;

export function FormSelect(props: SelectProps) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelAbove={props.labelAbove}
      labelSize={props.labelSize}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <select
        id={props.id}
        className="form-control"
        defaultValue={props.value as TODO || ''}
        onChange={props.onChange as TODO}
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
      labelAbove={props.labelAbove}
      labelSize={props.labelSize}
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
