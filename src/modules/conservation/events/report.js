import React from 'react';
import { I18n } from 'react-i18nify';
import type { ReportProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function Report(props: ReportProps) {
  const suffix = ':';
  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`archiveReference_${props.index}`}>
            {I18n.t('musit.conservation.events.report.archiveReference') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`archiveReference_${props.index}`}>
              {props.report.archiveReference}
            </p>
          ) : (
            <input
              className="form-control"
              id={`archiveReference_${props.index}`}
              value={props.report.archiveReference}
              onChange={t => props.onChange('archiveReference')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.report}
      eventName={I18n.t('musit.conservation.events.report.report')}
      noteLabel={I18n.t('musit.conservation.events.report.note')}
      extraAttributes={extraAttributes}
    />
  );
}
