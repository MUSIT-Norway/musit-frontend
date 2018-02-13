import React from 'react';
import { I18n } from 'react-i18nify';
import type { MeasurmentEventProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function MeasurmentEvent(props: MeasurmentEventProps) {
  const suffix = ':';

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-1">
          <label className="control-label h4" htmlFor={`weight${props.index}`}>
            {I18n.t('musit.conservation.events.measurementDetermination.weight') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`weight${props.index}`}>
              {props.measurementDetermination.weight}
            </p>
          ) : (
            <input
              className="form-control"
              id={`weight${props.index}`}
              value={props.measurementDetermination.weight}
              onChange={t => props.onChange('weight')(t.target.value)}
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
      subEvent={props.measurementDetermination}
      eventName={I18n.t(
        'musit.conservation.events.measurementDetermination.measurementDetermination'
      )}
      noteLabel={I18n.t('musit.conservation.events.measurementDetermination.note')}
      extraAttributes={extraAttributes}
    />
  );
}
