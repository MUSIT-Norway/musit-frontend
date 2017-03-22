import React from 'react';
const Table = require('reactable').Table;
const Tr = require('reactable').Tr;
const Td = require('reactable').Td;
import './eventsComponent.css';

export const EventsComponent = (props) => (
  <div>
    <br />
    <Table
      className="table"
      columns={[
        { key: 'eventDate', label: 'Dato'},
        { key: 'type', label: 'Type hendelse'},
        { key: 'registeredBy', label: 'Utført av' },
        { key: 'note', label: 'Kommentar' },
        { key: 'id', label: '' }
      ]}
      sortable={['type', 'eventDate', 'registeredBy', 'note' ]}
      defaultSort={{ column: 'eventDate', direction: 'desc' }}
      noDataText="Ingen hendelser funnet på objektet"
    >
      {props.events && props.events.map((event, i) =>
        <Tr key={i}>
          <Td column="eventDate">{event.eventDate}</Td>
          <Td column="type">{event.type}</Td>
          <Td column="registeredBy">{event.registeredBy}</Td>
          <Td column="note">{event.note || ''}</Td>
          <Td column="id"><a href="#" onClick={(e) => e.preventDefault()}>Les mer</a></Td>
        </Tr>
      )}
    </Table>
  </div>
);

export default EventsComponent;