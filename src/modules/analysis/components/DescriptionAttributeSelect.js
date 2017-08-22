// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import { isMultipleSelectAttribute } from '../../../types/analysis';
import type { DomEvent } from '../../../types/dom';
import type { DescriptionAttributeType } from './DescriptionAttributeType';

type Props = {
  attr: DescriptionAttributeType,
  onChange: (e: DomEvent) => void,
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
      onChange={props.onChange}
      defaultValue={props.value ? props.value.toString() : ''}
    >
      <option value="">{I18n.t('musit.sample.chooseUnit')}</option>
      {props.attr.allowedValues &&
        props.attr.allowedValues.map((av, i) => (
          <option key={i} value={av.id}>
            {av.enLabel}
          </option>
        ))}
    </select>
  );
};

export default DescriptionAttributeSelect;
