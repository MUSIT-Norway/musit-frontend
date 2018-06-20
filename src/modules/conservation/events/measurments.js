import React from 'react';
import { I18n } from 'react-i18nify';
import type { MeasurmentEventProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function MeasurmentEvent(props: MeasurmentEventProps) {
  const suffix = ':';

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`materiale_${props.index}`}>
            {I18n.t('musit.conservation.events.materialDetermination.material') + suffix}
          </label>
          {// we have change the below code with component
          props.viewMode ? (
            <p className="form-control-static" id={`materiale_${props.index}`}>
              {props.materialDetermination.materialInfo &&
              props.materialDetermination.materialInfo.length > 0 &&
              props.materialDeterminationList
                ? props.materialDetermination.materialInfo.map(m => (
                    <div>
                      {' '}
                      {m.materialId + '  ' + m.materialExtra + '  ' + m.sorting}{' '}
                    </div>
                  ))
                : ''}
            </p>
          ) : (
            'Add component for materialInfo'
          )}
        </div>
      </div>
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.materialDetermination}
      eventName={I18n.t(
        'musit.conservation.events.materialDetermination.materialDetermination'
      )}
      noteLabel={I18n.t('musit.conservation.events.materialDetermination.note')}
      extraAttributes={extraAttributes}
    />
  );
}
