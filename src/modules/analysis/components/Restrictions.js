// @flow
import React from 'react';
import { ActorSuggest } from '../../../components/suggest/ActorSuggest';
import DatePicker from '../../../components/DatePicker';
import { DATE_FORMAT_DISPLAY, formatISOString } from '../../../shared/util';
import type { AppSession } from '../../../types/appSession';
import type { Field, Update } from '../../../forms/form';
import { I18n } from 'react-i18nify';

type Form = {
  restrictions_requesterName: Field<string>,
  restrictions_requester: Field<string>,
  restrictions_caseNumbers: Field<Array<string>>,
  restrictions_reason: Field<string>,
  restrictions_expirationDate: Field<string>
};

type Props = {
  appSession: AppSession,
  form: Form,
  updateForm: (update: Update<*>) => void
};

export default function Restrictions({ appSession, form, updateForm }: Props) {
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictedBy">
          {I18n.t('musit.analysis.restrictions.restrictionsFor')}
        </label>
        <div className="col-md-10">
          <ActorSuggest
            appSession={appSession}
            id="restrictions_requester"
            value={form.restrictions_requesterName.rawValue || ''}
            placeHolder="Find actor"
            onChange={actor => {
              updateForm({
                name: form.restrictions_requesterName.name,
                rawValue: actor.fn
              });
              updateForm({
                name: form.restrictions_requester.name,
                rawValue: actor.dataportenId
              });
            }}
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
            value={form.restrictions_reason.rawValue || ''}
            onChange={e =>
              updateForm({
                name: form.restrictions_reason.name,
                rawValue: e.target.value
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
              (Array.isArray(form.restrictions_caseNumbers.rawValue) &&
                form.restrictions_caseNumbers.rawValue.join(', ')) ||
                ''
            }
            onChange={e =>
              updateForm({
                name: form.restrictions_caseNumbers.name,
                rawValue: e.target.value.split(',').map(v => v.trim())
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
            value={form.restrictions_expirationDate.rawValue || ''}
            onChange={e =>
              updateForm({
                name: form.restrictions_expirationDate.name,
                rawValue: formatISOString(e)
              })}
          />
        </div>
      </div>
    </div>
  );
}
