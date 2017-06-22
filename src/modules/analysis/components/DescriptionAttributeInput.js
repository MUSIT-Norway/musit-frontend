// @flow
import React from 'react';

type Props = {
  attr: {
    attributeKey: string,
    attributeType: string
  },
  onChange: (name: string, type: string) => (e: *) => void,
  value: ?string | ?Array<string | number>
};

const DescriptionAttributeInput = (props: Props) => {
  return (
    <input
      className="form-control"
      type="text"
      name={props.attr.attributeKey}
      onChange={props.onChange(props.attr.attributeKey, props.attr.attributeType)}
      value={(props.value && props.value.toString()) || ''}
    />
  );
};

export default DescriptionAttributeInput;
