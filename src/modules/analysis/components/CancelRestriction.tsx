// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { Restriction } from '../../../types/analysis';
import StatefulActorSuggest from './StatefulActorSuggest';
import { FormElement } from '../../../forms/components';

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
      <FormElement
        id="restrictedBy"
        label={I18n.t('musit.analysis.restrictions.cancelledBy')}
        labelWidth={2}
        elementWidth={10}
        hasError={!props.isRestrictionValidForCancellation}
      >
        <StatefulActorSuggest
          id="restrictedBy"
          value={props.restriction.cancelledByName}
          appSession={props.appSession}
          onChange={actorId =>
            props.updateRestriction({
              ...props.restriction,
              cancelledBy: actorId
            })
          }
        />
      </FormElement>
      <FormElement
        id="cancelCause"
        label={I18n.t('musit.analysis.restrictions.reasonForCancelling')}
        labelWidth={2}
        elementWidth={10}
        hasError={!props.isRestrictionValidForCancellation}
      >
        <input
          className="form-control"
          id="cancelCause"
          value={props.restriction.cancelledReason || ''}
          onChange={e =>
            props.updateRestriction({
              ...props.restriction,
              cancelledReason: e.target.value
            })
          }
        />
        {!props.restriction.cancelledStamp && (
          <button
            className="btn btn-default"
            disabled={!props.isRestrictionValidForCancellation}
            onClick={(e: any) => {
              e.preventDefault();
              props.clickCancel();
            }}
          >
            {I18n.t('musit.analysis.restrictions.cancelRestriction')}
          </button>
        )}
      </FormElement>
    </div>
  );
}
