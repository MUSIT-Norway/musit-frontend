/* @flow */
import React from 'react';
const { Table, Tr, Td } = require('reactable');
import type { Events } from '../../types/events';
import { I18n } from 'react-i18nify';

type EventTypeProps = { events: Events };

export const EventTableComponent = ({ events }: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table"
        columns={[
          { key: 'eventDate', label: 'Dato' },
          { key: 'type', label: 'Type hendelse' },
          { key: 'registeredBy', label: 'Utført av' },
          { key: 'keyData', label: 'Nøkkeldata' },
          { key: 'note', label: 'Kommentar' },
          { key: 'id', label: '' }
        ]}
        sortable={['type', 'eventDate', 'registeredBy', 'note' ]}
        noDataText={I18n.t('musit.events.noDataForObject')}
      >
        {events && events.map((event, i) =>
          <Tr key={i}>
            <Td column="eventDate">{event.eventDate}</Td>
            <Td column="type">{event.type}</Td>
            <Td column="registeredBy">{event.registeredBy}</Td>
            <Td column="keyData">{event.keyData}</Td>
            <Td column="note"><span>{event.note}</span></Td>
            <Td column="id">Les mer</Td>
          </Tr>
        )}
      </Table>
    </div>
  );
};
EventTableComponent.displayName = 'EventTableComponent';
export default EventTableComponent;