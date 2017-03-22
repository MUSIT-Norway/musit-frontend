import React from 'react';
const Table = require('reactable').Table;
const Tr = require('reactable').Tr;
const Td = require('reactable').Td;
import './eventsComponent.css';
import { Row, Col } from 'react-bootstrap';
import Breadcrumb from '../../components/layout/Breadcrumb';

export const EventsComponent = ({ events, location: { state } }) => (
  <div>
    <h1>Hendelser</h1>
    <hr />
    <Row>
        <Col sm={2}>
          Museumsnr:
        </Col>
        <Col sm={10}>
          {state.museumNo}
        </Col>
    </Row>
    <Row>
      <Col sm={2}>
        Unr:
      </Col>
      <Col sm={10}>
        {state.subNo}
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        Term/Artsnavn:
      </Col>
      <Col sm={10}>
        {state.term}
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        Plassering:
      </Col>
      <Col sm={10}>
        {events.currentLocation && <Breadcrumb node={events.currentLocation.breadcrumb} disabled />}
      </Col>
    </Row>
    <br />
    {events.data &&
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
        {events.data.map((event, i) =>
          <Tr key={i}>
            <Td column="eventDate">{event.eventDate}</Td>
            <Td column="type">{event.type}</Td>
            <Td column="registeredBy">{event.registeredBy}</Td>
            <Td column="note">{event.note || ''}</Td>
            <Td column="id"><a href="#" onClick={(e) => e.preventDefault()}>Les mer</a></Td>
          </Tr>
        )}
      </Table>
    }
  </div>
);

export default EventsComponent;