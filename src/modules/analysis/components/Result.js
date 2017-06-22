// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import Sample from '../../../models/sample';

type Props = {
  externalSource: ?string,
  updateExternalSource: (value: string) => void,
  comments: ?string,
  updateComments: (value: string) => void,
  extraAttributes: any,
  updateExtraResultAttribute: Function
};

export default function Result({
  externalSource,
  updateExternalSource,
  comments,
  updateComments,
  extraAttributes,
  updateExtraResultAttribute
}: Props) {
  return (
    <div>
      {extraAttributes &&
        Object.keys(extraAttributes).filter(eat => eat !== 'type').map((attrKey, i) => {
          return (
            <div className="form-group" key={i}>
              <label className="control-label col-md-2" htmlFor="externalSource">
                {attrKey}
              </label>
              {extraAttributes[attrKey].type === 'Size'
                ? <div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        name={attrKey}
                        value={
                          (extraAttributes[attrKey].value &&
                            extraAttributes[attrKey].value.rawValue) ||
                            ''
                        }
                        onChange={e =>
                          updateExtraResultAttribute(attrKey, {
                            ...extraAttributes[attrKey].value,
                            value: parseFloat(e.target.value.replace(',', '.')),
                            rawValue: e.target.value
                          })}
                      />
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-control"
                        onChange={e =>
                          updateExtraResultAttribute(attrKey, {
                            ...extraAttributes[attrKey].value,
                            unit: e.target.value
                          })}
                        defaultValue={
                          (extraAttributes[attrKey].value &&
                            extraAttributes[attrKey].value.unit) ||
                            ''
                        }
                      >
                        <option value="">{I18n.t('musit.sample.chooseUnit')}</option>
                        {Sample.sampleSizeUnits.map((unit, i) => (
                          <option key={i}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                : <div className="col-md-5">
                    <input
                      className="form-control"
                      name={attrKey}
                      value={extraAttributes[attrKey].value || ''}
                      onChange={e => updateExtraResultAttribute(attrKey, e.target.value)}
                    />
                  </div>}
            </div>
          );
        })}
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
