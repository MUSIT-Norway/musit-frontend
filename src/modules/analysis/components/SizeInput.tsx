// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { parseValue } from '../shared/getters';
import { Maybe, TODO } from '../../../types/common';

type Props = {
  attrKey: string;
  attribute: {
    value?: Maybe<number>;
    rawValue?: Maybe<string>;
    unit?: Maybe<string>;
  };
  allowedValues?: Maybe<Array<string>>;
  onChange: Function;
};

const Size = (props: Props) => {
  const value = props.attribute.value || null;
  const unit = props.attribute.unit || null;
  const borderColorValue = unit && (!value || typeof value !== 'number') ? 'red' : '';
  const borderColorUnit = value && (!unit || typeof unit !== 'string') ? 'red' : '';
  return (
    <div className="row">
      <div className="col-md-8">
        <input
          className="form-control"
          id={props.attrKey}
          style={{
            borderColor: borderColorValue
          }}
          value={props.attribute.rawValue || ''}
          onChange={e => {
            const value = {
              ...props.attribute,
              rawValue: e.target.value
            };
            const parsed = parseValue(value);
            return props.onChange(parsed);
          }}
        />
      </div>
      <div className="col-md-4">
        <select
          className="form-control"
          style={{
            borderColor: borderColorUnit
          }}
          onChange={e =>
            props.onChange({
              ...props.attribute,
              unit: e.target.value
            })
          }
          defaultValue={unit as TODO}
        >
          <option value="">{I18n.t('musit.sample.chooseUnit')}</option>
          {(props.allowedValues || []).map((unit, i) => <option key={i}>{unit}</option>)}
        </select>
      </div>
    </div>
  );
};

export default Size;
