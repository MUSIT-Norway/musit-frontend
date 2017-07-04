// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import NavigateToObject from '../../../components/navigations/NavigateToObject';

type Props = {
  externalSource: ?string,
  updateExternalSource: (value: string) => void,
  comments: ?string,
  updateComments: (value: string) => void,
  extraAttributes: any,
  updateExtraResultAttribute: Function,
  history: History,
  appSession: AppSession,
  parentObjectId?: ?string
};

type ResultFieldProps = {
  attrKey: string,
  attribute: {
    value?: {
      value?: ?string,
      rawValue?: ?string
    },
    allowedValues?: Array<string>
  },
  onChange: Function
};

const Size = (props: ResultFieldProps) => (
  <div>
    <div className="col-md-3">
      <input
        className="form-control"
        name={props.attrKey}
        value={(props.attribute.value && props.attribute.value.rawValue) || ''}
        onChange={e =>
          props.onChange({
            ...props.attribute.value,
            value: parseFloat(e.target.value.replace(',', '.')),
            rawValue: e.target.value
          })}
      />
    </div>
    <div className="col-md-2">
      <select
        className="form-control"
        onChange={e =>
          props.onChange({
            ...props.attribute.value,
            unit: e.target.value
          })}
        defaultValue={(props.attribute.value && props.attribute.value.unit) || ''}
      >
        <option value="">{I18n.t('musit.sample.chooseUnit')}</option>
        {(props.attribute.allowedValues || [])
          .map((unit, i) => <option key={i}>{unit}</option>)}
      </select>
    </div>
  </div>
);

const StringSelect = (props: ResultFieldProps) => (
  <div className="col-md-5">
    <select
      className="form-control"
      name={props.attrKey}
      onChange={e => props.onChange(e.target.value)}
      defaultValue={props.attribute.value || ''}
    >
      <option value="">{I18n.t('musit.texts.chooseValue')}</option>
      {(props.attribute.allowedValues || [])
        .map((value, i) => <option key={i}>{value}</option>)}
    </select>
  </div>
);

const StringInput = (props: ResultFieldProps) => (
  <div className="col-md-5">
    <input
      className="form-control"
      name={props.attrKey}
      value={props.attribute.value || ''}
      onChange={e => props.onChange(e.target.value)}
    />
  </div>
);

export default function Result({
  externalSource,
  updateExternalSource,
  comments,
  updateComments,
  extraAttributes,
  updateExtraResultAttribute,
  history,
  appSession,
  parentObjectId
}: Props) {
  return (
    <div>
      {extraAttributes &&
        Object.keys(extraAttributes)
          .filter(eat => eat !== 'type')
          .map((attrKey: string, i: number) => (
            <div className="form-group" key={i}>
              <label className="control-label col-md-2" htmlFor="externalSource">
                {attrKey}
              </label>
              {extraAttributes[attrKey].type === 'Size'
                ? <Size
                    attrKey={attrKey}
                    attribute={extraAttributes[attrKey]}
                    onChange={value => updateExtraResultAttribute(attrKey, value)}
                  />
                : extraAttributes[attrKey].allowedValues
                    ? <StringSelect
                        attrKey={attrKey}
                        attribute={extraAttributes[attrKey]}
                        onChange={value => updateExtraResultAttribute(attrKey, value)}
                      />
                    : <StringInput
                        attrKey={attrKey}
                        attribute={extraAttributes[attrKey]}
                        onChange={value => updateExtraResultAttribute(attrKey, value)}
                      />}
            </div>
          ))}
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="externalSource">
          {I18n.t('musit.analysis.externalSource')}
        </label>
        <div className="col-md-5">
          <input
            className="form-control"
            id="externalSource"
            value={externalSource || ''}
            onChange={e => updateExternalSource(e.target.value)}
          />
        </div>
        <div className="pull-right">
          {parentObjectId &&
            <NavigateToObject
              objectId={parentObjectId}
              appSession={appSession}
              history={history}
            />}
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="resultNote">
          {I18n.t('musit.analysis.commentsToResult')}
        </label>
        <div className="col-md-5">
          <textarea
            className="form-control"
            rows={5}
            id="resultNote"
            value={comments || ''}
            onChange={e => updateComments(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
