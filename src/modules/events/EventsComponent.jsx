import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { Row, Col } from 'react-bootstrap';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';


export const EventsComponent = ({ eventsStore: { object, data, currentLocation } }) => (
  <div>
    <h1>Hendelser</h1>
    <hr />
    <Row>
      <Col sm={2}>
        <b>Museumsnr:</b>
      </Col>
      <Col sm={10}>
        {object && object.museumNo}
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        <b>Unr:</b>
      </Col>
      <Col sm={10}>
        {object && object.subNo}
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        <b>Term/Artsnavn:</b>
      </Col>
      <Col sm={10}>
        {object && object.term}
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        <b>Plassering:</b>
      </Col>
      <Col sm={10}>
        {currentLocation && <Breadcrumb node={currentLocation.breadcrumb} disabled />}
      </Col>
    </Row>
    <br />
    {data &&
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
        noDataText={I18n.t('musit.events.noDataForObject')}
      >
        {data.map((event, i) =>
          <Tr key={i}>
            <Td column="eventDate">{event.eventDate}</Td>
            <Td column="type">{event.type}</Td>
            <Td column="registeredBy">{event.registeredBy}</Td>
            <Td column="note"><span>{event.note}</span></Td>
            <Td column="id">Les mer</Td>
          </Tr>
        )}
      </Table>
    }
  </div>
);

export default EventsComponent;