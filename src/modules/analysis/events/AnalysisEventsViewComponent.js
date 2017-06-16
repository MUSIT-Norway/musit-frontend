// @flow

import React from 'react';
import { I18n } from 'react-i18nify';
import AnalysisEventsTableComponent from './AnalysisEventsTableComponent';
import Loader from 'react-loader';
import { MusitField } from '../../../components/formfields';

import type { AnalysisCollectionExtended } from './analysisEventsStore';
import type { AppSession } from 'types/appSession';

type Props = {
  analysisEventsStore: {
    analysisEvents: Array<AnalysisCollectionExtended>,
    analysisEventsFiltered: Array<AnalysisCollectionExtended>,
    loading: boolean,
    filterEventValue: string
  },
  appSession: AppSession,
  filterEvents: (str: string) => void,
  goToAnalysis: (appSession: AppSession, analysisId: number) => void
};

const AnalysisEventsViewComponent = (props: Props) => (
  <div className="container">
    <div className="page-header">
      <h1>
        {I18n.t('musit.analysis.analysis')}
      </h1>
    </div>
    <Loader loaded={!props.analysisEventsStore.loading}>

      <div className="row">
        <div className="col-md-12" style={{ float: 'right', width: '400px' }}>
          <MusitField
            id="filter-analysis-events"
            value={props.analysisEventsStore.filterEventValue}
            placeHolder="Filter the list"
            onChange={props.filterEvents}
            addOnPrefix={'\u2315'}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <AnalysisEventsTableComponent
            events={props.analysisEventsStore.analysisEventsFiltered}
            onRowClicked={analysisId => props.goToAnalysis(props.appSession, analysisId)}
            language={props.appSession.language}
          />
        </div>
      </div>
    </Loader>

  </div>
);

export default AnalysisEventsViewComponent;
