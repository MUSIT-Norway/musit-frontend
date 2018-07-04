// @flow
import * as React from 'react';
import DescriptionAttributeSelect from './DescriptionAttributeSelect';
import DescriptionAttributeInput from './DescriptionAttributeInput';
import { DescriptionAttributeType } from './DescriptionAttributeType';
import { InputProps, ElementProps } from '../../../forms/components';
import { FormElement } from '../../../forms/components';
import { TODO } from '../../../types/common';

export type AttributeProps = InputProps & {
  attr: DescriptionAttributeType;
} & ElementProps;

export default function FormDescriptionAttribute(props: AttributeProps) {
  const DescriptionAttributeCmp = props.attr.allowedValues
    ? DescriptionAttributeSelect
    : DescriptionAttributeInput;
  const defaultValue = props.attr.allowedValues ? [] : '';
  return (
    <FormElement
      id={props.id}
      label={props.label}
      labelWidth={props.labelWidth}
      elementWidth={props.elementWidth}
    >
      <DescriptionAttributeCmp
        attr={props.attr}
        value={(props.value || defaultValue) as TODO}
        onChange={props.onChange as TODO}
      />
    </FormElement>
  );
}
