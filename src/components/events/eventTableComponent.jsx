// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { Events } from '../../types/events';
import type { AnalysisTypes } from '../../types/analysisTypes';
import type { SampleTypes } from '../../types/sampleTypes';


type EventTypeProps = { events: Events, onClick: Function, analysisTypes: AnalysisTypes, sampleTypes: SampleTypes };

const toPathStr = pathArr => pathArr.map(o => o.name).join('  /  ');

function getKeyData(e: Object, a: Object, s:Object){
  if (e.type) {
    if((e.type === 'AnalysisCollection' ||e.type === 'Analysis' )&& a.analysisTypes) {
      const analysisType: AnalysisTypes = a.analysisTypes.find(f => f.id && f.id === e.analysisTypeId);
      return analysisType.name ;
    }
    if(e.type === 'MoveObject') {
      return toPathStr(e.to.breadcrumb);
    }
    if(e.type === 'SampleCreated' && e.sampleTypeId && s.sampleTypes) {
      const sampleType: SampleTypes = s.sampleTypes.find(f => f.sampleTypeId && f.sampleTypeId === e.sampleTypeId);
      return sampleType.sampleType;
    }
  }
  return '';
}

export const EventTableComponent = ({ events, onClick, analysisTypes, sampleTypes }: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table"
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
            <Td column="keyData">{getKeyData(event, analysisTypes, sampleTypes)}</Td>
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