// @flow
import React from 'react';
import { I18n } from 'react-i18nify';

type Props = {
  attr: {
    attributeKey: string,
    attributeType: string,
    allowedValues: ?Array<{ id: number, enLabel: string, noLabel: string }>
  },
  onChange: (name: string, type: string) => (e: *) => void,
  value: ?string | ?Array<string | number>
};

const DescriptionAttributeSelect = (props: Props) => {
  return (
    <select
      multiple={/^Array\[.*]$/.test(props.attr.attributeType)}
      className="form-control"
      name={props.attr.attributeKey}
      size={props.attr.allowedValues && props.attr.allowedValues.length}
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
