/* @flow */
import React from 'react';
const { Table, Tr, Td } = require('reactable');
import type { T_Events } from '../../types/events';

type EventTypeProps = { events: T_Events };

export const EventTableComponent = ({ events }: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table"
        columns={[
          { key: 'eventDate', label: 'Dato' },
          { key: 'eventType', label: 'Type hendelse' },
          { key: 'registeredBy', label: 'Utført av' },
          { key: 'keyData', label: 'Nøkkeldata' },
          { key: 'note', label: 'Kommentar' },
          { key: 'id', label: '' }
        ]}
        sortable={['eventType', 'eventDate', 'registeredBy', 'note' ]}
        noDataText="Ingen hendelser funnet på objektet"
      >
        {events && events.map((event, i) =>
          <Tr key={i}>
            <Td column="eventDate">{event.eventDate}</Td>
            <Td column="type">{event.eventType}</Td>
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

export default EventTableComponent;