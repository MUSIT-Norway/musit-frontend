// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { Event, Events } from '../../types/events';

import type { AnalysisTypesObject, AnalysisTypes, AnalysisType } from '../../types/analysisTypes';
import type { SampleTypesObject, SampleTypes, SampleType } from '../../types/sampleTypes';
import type { AppSession } from '../../types/appSession';

type EventTypeProps = {
  events: Events,
  onClick: Function,
  analysisTypes: AnalysisTypesObject,
  sampleTypes: SampleTypesObject,
  appSession: AppSession
};

const toPathStr = pathArr => pathArr.map(o => o.name).join('  /  ');

function getKeyData(event: Event, analysisTypes: AnalysisTypes, sampleTypes: SampleTypes, appSession: AppSession){
  if (event.type) {
    if((event.type === 'AnalysisCollection' ||event.type === 'Analysis' )&& analysisTypes) {
      const analysisTypeFound: ?AnalysisType = analysisTypes.find(f => f.id && f.id === event.analysisTypeId);
      if (analysisTypeFound) {
        return appSession.language.isEn ? analysisTypeFound.enName : analysisTypeFound.noName;
      }
    }
    if(event.type === 'MoveObject') {
      return toPathStr(event.to.breadcrumb);
    }
    if(event.type === 'SampleCreated' && event.sampleTypeId && sampleTypes) {
      const sampleTypeFound: ?SampleType = sampleTypes.find(f => f.sampleTypeId && f.sampleTypeId === event.sampleTypeId);
      if (sampleTypeFound) {
        return appSession.language.isEn ? sampleTypeFound.enSampleType : sampleTypeFound.noSampleType;
      }
    }
  }
  return '';
}

export const EventTableComponent = ({ events, onClick, analysisTypes, sampleTypes, appSession }: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table table-hover table-inverse table-responsive"
        columns={[
          { key: 'doneDate', label: 'Utført dato' },
          { key: 'type', label: 'Type hendelse' },
          { key: 'doneBy', label: 'Utført av' },
          { key: 'keyData', label: 'Nøkkeldata' },
          { key: 'caseNumber', label: 'Saksnummer' },
          { key: 'note', label: 'Kommentar' }
        ]}
        sortable={['id', 'type', 'eventDate', 'registeredBy', 'note' ]}
        noDataText={I18n.t('musit.events.noDataForObject')}
      >
        {events && events.map((event, i) =>
          <Tr key={i} onClick={() => onClick(event)}>
            <Td column="doneDate">{event.type && event.type === 'MoveObject' ? event.doneDate : event.registeredDate }</Td>
            <Td column="type">{event.type ? I18n.t(`musit.objects.objectsView.eventTypes.${event.type}`) : ''}</Td>
            <Td column="doneBy">{event.type && event.type === 'MoveObject' ? event.doneBy : event.registeredBy }</Td>
            <Td column="keyData">{getKeyData(event, analysisTypes.analysisTypes, sampleTypes.sampleTypes, appSession)}</Td>
            <Td column="caseNumber">{event.caseNumbers ? event.caseNumbers.join('; '): ''}</Td>
            <Td column="note"><span>{event.note}</span></Td>
          </Tr>
        )}
      </Table>
    </div>
  );
};
EventTableComponent.displayName = 'EventTableComponent';
export default EventTableComponent;