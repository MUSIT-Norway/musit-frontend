// @flow

import React from 'react';
import { I18n } from 'react-i18nify';
import moment from 'moment';
import type { AnalysisCollectionExtended } from './analysisEventsStore';
import type { Language } from 'types/appSession';
import type { AnalysisType } from 'types/analysis';

type TableProps = {
  events: Array<AnalysisCollectionExtended>,
  onRowClicked: (id: number) => void,
  language: Language
};

const formattedDate = (date: ?string) => date && moment(date).format('DD.MM.YYYY');

const statusText = (status: ?number) =>
  status && I18n.t('musit.analysis.statusType.' + status);

const analysisTypeName = (language: Language, analysisType: ?AnalysisType) => {
  if (analysisType) {
    return language.isEn ? analysisType.enName : analysisType.noName;
  } else {
    return I18n.t('musit.unknown');
  }
};

const AnalysisEventsTableComponent = (props: TableProps) => (
  <div className="table-responsive">
    <table className="table table-condensed table-hover">
      <thead>
        <tr className="reactable-column-header">
          <th>{I18n.t('musit.texts.dateRegistered')}</th>
          <th>{I18n.t('musit.analysis.analysisType')}</th>
          <th>{I18n.t('musit.analysis.status')}</th>
          <th>{I18n.t('musit.texts.registeredBy')}</th>
        </tr>
      </thead>

      <tbody>

        {props.events.map(event => (
          <tr key={event.id} onClick={() => event.id && props.onRowClicked(event.id)}>
            <td>{formattedDate(event.registeredDate)}</td>
            <td>{analysisTypeName(props.language, event.analysisType)}</td>
            <td>{statusText(event.status)}</td>
            <td>{event.registeredByName}</td>
          </tr>
        ))}

      </tbody>
    </table>
  </div>
);

export default AnalysisEventsTableComponent;
