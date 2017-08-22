// @flow
import React from 'react';
import DatePicker from '../../../components/DatePicker';
import { DATE_FORMAT_DISPLAY, formatISOString } from '../../../shared/util';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { Restriction } from '../../../types/analysis';
import StatefulActorSuggest from './StatefulActorSuggest';

type Props = {
  appSession: AppSession,
  restriction: Restriction,
  updateRestriction: (restriction: Restriction) => void
};

export default function AddRestriction(props: Props) {
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictedBy">
          {I18n.t('musit.analysis.restrictions.restrictionsFor')}
        </label>
        <div className="col-md-10">
          <StatefulActorSuggest
            value={props.restriction.requesterName}
            appSession={props.appSession}
            onChange={actorId =>
              props.updateRestriction({
                ...props.restriction,
                requester: actorId
              })}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionCause">
          {I18n.t('musit.analysis.restrictions.reasonForRestriction')}
        </label>
        <div className="col-md-10">
          <input
            className="form-control"
            id="restrictionCause"
            value={props.restriction.reason || ''}
            onChange={e =>
              props.updateRestriction({
                ...props.restriction,
                reason: e.target.value
              })}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionCaseNumbers">
          {I18n.t('musit.analysis.restrictions.caseNumber')}
        </label>
        <div className="col-md-5">
          <input
            className="form-control"
            id="restrictionCaseNumbers"
            value={
              (Array.isArray(props.restriction.caseNumbers) &&
                props.restriction.caseNumbers.join(', ')) ||
                ''
            }
            onChange={e =>
              props.updateRestriction({
                ...props.restriction,
                caseNumbers: e.target.value.split(',').map(v => v.trim()).filter(v => v)
              })}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionExpirationEndDate">
          {I18n.t('musit.analysis.restrictions.endDate')}
        </label>
        <div className="col-md-5">
          <DatePicker
            dateFormat={DATE_FORMAT_DISPLAY}
            value={props.restriction.expirationDate || ''}
            onClear={() =>
              props.updateRestriction({
                ...props.restriction,
                expirationDate: null
              })}
            onChange={selectedDate => {
              if (selectedDate !== 'Invalid date') {
                props.updateRestriction({
                  ...props.restriction,
                  expirationDate: formatISOString(selectedDate)
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
