import React from 'react';
import { I18n } from 'react-i18nify';
import type { ReportProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function Report(props: ReportProps) {
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.report}
      eventName={I18n.t('musit.conservation.events.report.report')}
      noteLabel={I18n.t('musit.conservation.events.report.note')}
    />
  );
}
