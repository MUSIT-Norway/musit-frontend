// @flow
import * as React from 'react';
import { ChangeEventHandler } from 'react';
import { DescriptionAttributeType } from './DescriptionAttributeType';
import { Maybe } from '../../../types/common';

interface DescriptionAttributeInputProps {
  attr: DescriptionAttributeType;
  onChange: ChangeEventHandler<HTMLElement>;
  value: Maybe<string> | Maybe<Array<string | number>>;
}

const DescriptionAttributeInput = (props: DescriptionAttributeInputProps) => {
  return (
    <input
      className="form-control"
      type="text"
      name={props.attr.attributeKey}
      onChange={props.onChange}
      value={props.value ? props.value.toString() : ''}
    />
  );
};

export default DescriptionAttributeInput;
