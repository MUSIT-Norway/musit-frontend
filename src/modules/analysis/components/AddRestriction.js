// @flow
import React from 'react';
import DatePicker from '../../../components/DatePicker';
import { DATE_FORMAT_DISPLAY, formatISOString } from '../../../shared/util';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../../types/appSession';
import type { Restriction } from '../../../types/analysis';
import StatefulActorSuggest from './StatefulActorSuggest';
import { FormElement, FormInput } from '../../../forms/components';

type Props = {
  appSession: AppSession,
  restriction: Restriction,
  updateRestriction: (restriction: Restriction) => void
};

export default function AddRestriction(props: Props) {
  return (
    <div>
      <FormElement
        id="restrictedBy"
        label={I18n.t('musit.analysis.restrictions.restrictionsFor')}
        labelWidth={2}
        elementWidth={10}
      >
        <StatefulActorSuggest
          id="restrictedBy"
          value={props.restriction.requesterName}
          appSession={props.appSession}
          onChange={actorId =>
            props.updateRestriction({
              ...props.restriction,
              requester: actorId
            })}
        />
      </FormElement>
      <FormInput
        id="restrictionCause"
        label={I18n.t('musit.analysis.restrictions.reasonForRestriction')}
        labelWidth={2}
        elementWidth={10}
        value={props.restriction.reason}
        onChange={e =>
          props.updateRestriction({
            ...props.restriction,
            reason: e.target.value
          })}
      />
      <FormInput
        id="restrictionCaseNumbers"
        label={I18n.t('musit.analysis.restrictions.caseNumber')}
        labelWidth={2}
        elementWidth={10}
        value={
          (Array.isArray(props.restriction.caseNumbers) &&
            props.restriction.caseNumbers.join(', ')) ||
          ''
        }
        onChange={e =>
          props.updateRestriction({
            ...props.restriction,
            caseNumbers: e.target.value
              .split(',')
              .map(v => v.trim())
              .filter(v => v)
          })}
      />
      <FormElement
        id="restrictionExpirationEndDate"
        label={I18n.t('musit.analysis.restrictions.endDate')}
        labelWidth={2}
        elementWidth={10}
      >
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
      </FormElement>
    </div>
  );
}
