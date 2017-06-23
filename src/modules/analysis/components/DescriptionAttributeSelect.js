// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import { isMultipleSelectAttribute } from '../../../types/analysisTypes';

type Props = {
  attr: {
    attributeKey: string,
    attributeType: string,
    allowedValues: ?Array<{ id: number, enLabel: string, noLabel: string }>
  },
  onChange: (name: string, type: string) => () => void,
  value: ?string | ?Array<string | number>
};

const DescriptionAttributeSelect = (props: Props) => {
  let multiple = isMultipleSelectAttribute(props.attr.attributeType);
  return (
    <select
      multiple={multiple}
      className="form-control"
      name={props.attr.attributeKey}
      size={multiple && props.attr.allowedValues ? props.attr.allowedValues.length : 1}
      onChange={props.onChange(props.attr.attributeKey, props.attr.attributeType)}
    >
      <option value="">{I18n.t('musit.sample.chooseUnit')}</option>
      {props.attr.allowedValues &&
        props.attr.allowedValues.map((av, i) => (
          <option
            key={i}
            value={av.id}
            selected={props.value && [].concat(props.value).find(v => v === av.id)}
          >
            {av.enLabel}
          </option>
        ))}
    </select>
  );
};

export default DescriptionAttributeSelect;
