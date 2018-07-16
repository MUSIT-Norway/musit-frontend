// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { Maybe } from '../../../types/common';

type Props = {
  sampleType: Maybe<string>;
  subTypeValue: Maybe<string>;
};

export default function ReadOnlySampleType({ sampleType, subTypeValue }: Props) {
  return (
    <div className="form-group">
      <label className="control-label col-md-2">
        {I18n.t('musit.sample.sampleType')}
      </label>
      <div className="col-md-3">
        <p className="form-control-static">{sampleType}</p>
      </div>
      {sampleType !== subTypeValue && (
        <div>
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleSubType')}
          </label>
          <div className="col-md-3">
            <p className="form-control-static">{subTypeValue}</p>
          </div>
        </div>
      )}
    </div>
  );
}
