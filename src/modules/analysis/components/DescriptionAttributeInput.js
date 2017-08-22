// @flow
import React from 'react';
import type { DomEvent } from '../../../types/dom';
import type { DescriptionAttributeType } from './DescriptionAttributeType';

type Props = {
  attr: DescriptionAttributeType,
  onChange: (e: DomEvent) => void,
  value: ?string | ?Array<string | number>
};

const DescriptionAttributeInput = (props: Props) => {
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
