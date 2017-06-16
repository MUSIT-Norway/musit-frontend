// @flow
import React from 'react';
import { I18n } from 'react-i18nify';

type Props = {
  externalSource: ?string,
  updateExternalSource: (value: string) => void,
  comments: ?string,
  updateComments: (value: string) => void
};

export default function Result({
  externalSource,
  updateExternalSource,
  comments,
  updateComments
}: Props) {
  return (
    <div>
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
        <div className="col-md-10">
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
