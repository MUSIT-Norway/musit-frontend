// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { Restriction } from '../../../types/analysis';
import StatefulActorSuggest from './StatefulActorSuggest';

type Props = {
  appSession: AppSession,
  restriction: Restriction,
  updateRestriction: (restriction: Restriction) => void,
  clickCancel: () => void,
  isRestrictionValidForCancellation: boolean
};

export default function CancelRestriction(props: Props) {
  return (
    <div>
      <div
        className={`form-group ${!props.isRestrictionValidForCancellation ? 'has-error' : ''}`}
      >
        <label className="control-label col-md-2" htmlFor="restrictedBy">
          {I18n.t('musit.analysis.restrictions.cancelledBy')}
        </label>
        <div className="col-md-10">
          <StatefulActorSuggest
            value={props.restriction.cancelledByName}
            appSession={props.appSession}
            onChange={actorId =>
              props.updateRestriction({
                ...props.restriction,
                cancelledBy: actorId
              })}
          />
        </div>
      </div>
      <div
        className={`form-group ${!props.isRestrictionValidForCancellation ? 'has-error' : ''}`}
      >
        <label className="control-label col-md-2" htmlFor="cancelCause">
          {I18n.t('musit.analysis.restrictions.reasonForCancelling')}
        </label>
        <div className="col-md-10">
          <input
            className="form-control"
            id="cancelCause"
            value={props.restriction.cancelledReason || ''}
            onChange={e =>
              props.updateRestriction({
                ...props.restriction,
                cancelledReason: e.target.value
              })}
          />
          {!props.restriction.cancelledStamp &&
            <button
              className="btn btn-default"
              disabled={!props.isRestrictionValidForCancellation}
              onClick={(e: any) => {
                e.preventDefault();
                props.clickCancel();
              }}
            >
              {I18n.t('musit.analysis.restrictions.cancelRestriction')}
            </button>}

        </div>
      </div>
    </div>
  );
}
