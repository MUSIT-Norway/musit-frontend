import React from 'react';
import { I18n } from 'react-i18nify';
import type { HseRiskProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function HseRisk(props: HseRiskProps) {
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.hseRisk}
      eventName={I18n.t('musit.conservation.events.hseRisk.hseRisk')}
      noteLabel={I18n.t('musit.conservation.events.hseRisk.note')}
    />
  );
}
