import React from 'react';
import { I18n } from 'react-i18nify';
import type { TechnicalDescriptionType } from '../../../types/conservation';
import ObjectSelection from '../components/objectSelection';
import CollapsibleEvent from '../components/collapsibleEvent';

export type TechnicalDescriptionProps = {
  technicalDescription: TechnicalDescriptionType,
  index?: number,
  appSession?: AppSession,
  viewMode?: boolean,
  onChange: Function
};

export default function TechnicalDescription(props: TechnicalDescriptionProps) {
  const technicalDescComponent = (
    <div className="container">
      <div className="page-header">
        <h3>
          {I18n.t('musit.conservation.events.technicalDescription.technicalDescription')}
        </h3>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.techincalDescription.note')}
        </label>
        <div className="col-md-9">
          <textarea
            className="form-control"
            id={`note_${props.index}`}
            value={props.technicalDescription.note}
            onChange={t => props.onChange('note')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.technicalDescription.affectedThings}
        affectedThingsSubEventOnChange={t =>
          props.onChange('affectedThings')(t.map(s => s) || [])}
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <CollapsibleEvent
      eventName={I18n.t(
        'musit.conservation.events.technicalDescription.technicalDescription'
      )}
      eventComponent={technicalDescComponent}
    />
  );
}
