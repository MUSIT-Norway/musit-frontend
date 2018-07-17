import * as React from 'react';
import { I18n } from 'react-i18nify';
import { TechnicalDescriptionProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function TechnicalDescription(props: TechnicalDescriptionProps) {
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.technicalDescription}
      eventName={I18n.t(
        'musit.conservation.events.technicalDescription.technicalDescription'
      )}
      noteLabel={I18n.t('musit.conservation.events.technicalDescription.note')}
    />
  );
}
