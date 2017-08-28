// @flow
import React from 'react';
import SizeInput from './SizeInput';
import { FormElement } from '../../../forms/components';
import type { ElementProps } from '../../../forms/components';
import { I18n } from 'react-i18nify';

type Props = ElementProps & {
  type: string,
  value:
    | string
    | {
        value?: ?string,
        rawValue?: ?string,
        unit?: ?string
      },
  allowedValues?: ?Array<string>,
  onChange: (val: string) => void
};

export default function ExtraResultAttribute(props: Props) {
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      {props.type === 'Size'
        ? <SizeInput
            attrKey={props.id}
            attribute={typeof props.value !== 'string' ? props.value || {} : {}}
            allowedValues={props.allowedValues}
            onChange={props.onChange}
          />
        : <NormalInput {...props} />}
    </FormElement>
  );
}

function NormalInput(props) {
  return props.allowedValues
    ? <select
        className="form-control"
        id={props.id}
        onChange={e => props.onChange(e.target.value)}
        defaultValue={props.value || ''}
      >
        <option value="">{I18n.t('musit.texts.chooseValue')}</option>
        {(props.allowedValues || [])
          .map((value, i) => <option key={i} value={value}>{value}</option>)}
      </select>
    : <input
        className="form-control"
        id={props.id}
        value={props.value || ''}
        onChange={e => props.onChange(e.target.value)}
      />;
}
