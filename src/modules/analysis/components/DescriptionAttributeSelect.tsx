// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { isMultipleSelectAttribute } from '../../../types/analysis';
import { DescriptionAttributeType } from './DescriptionAttributeType';
import MusitI18n from '../../../components/MusitI18n';
import { ChangeEventHandler } from 'react';
import { Maybe } from '../../../types/common';

type Props = {
  attr: DescriptionAttributeType;
  onChange: ChangeEventHandler<HTMLElement>; // (e: DomEvent) => void,
  value: Maybe<string> | Maybe<Array<string | number>>;
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
            <MusitI18n en={av.enLabel} no={av.noLabel} />
          </option>
        ))}
    </select>
  );
};

export default DescriptionAttributeSelect;
