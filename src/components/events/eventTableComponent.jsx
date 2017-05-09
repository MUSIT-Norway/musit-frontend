/* @flow */
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { Events } from '../../types/events';

type EventTypeProps = { events: Events, onClick: Function };

export const EventTableComponent = ({ events, onClick }: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'eventDate', label: 'Dato' },
          { key: 'type', label: 'Type hendelse' },
          { key: 'registeredBy', label: 'Utført av' },
          { key: 'keyData', label: 'Nøkkeldata' },
          { key: 'note', label: 'Kommentar' }
        ]}
        sortable={['id', 'type', 'eventDate', 'registeredBy', 'note' ]}
        noDataText={I18n.t('musit.events.noDataForObject')}
      >
        {events && events.map((event, i) =>
          <Tr key={i} onClick={() => onClick(event)}>
            <Td column="id">{event.id || ''}</Td>
            <Td column="eventDate">{event.eventDate}</Td>
            <Td column="type">{event.type}</Td>
            <Td column="registeredBy">{event.registeredBy}</Td>
            <Td column="keyData">{event.keyData}</Td>
            <Td column="note"><span>{event.note}</span></Td>
          </Tr>
        )}
      </Table>
    </div>
  );
};
EventTableComponent.displayName = 'EventTableComponent';
export default EventTableComponent;