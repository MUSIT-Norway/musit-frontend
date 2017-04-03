/* @flow */
import React from 'react';
const {Table, Tr, Td} = require('reactable');
import {Row, Col, Tabs, Tab} from 'react-bootstrap';
import type { T_ObjectData } from '../../types/object';
import type { T_Samples } from '../../types/samples';
import type { T_Events } from  '../../types/events';

type EventTypeProps = { events: T_Events };
const EventTable = ({ events }: EventTypeProps) => {
  const cols = [
    {key: 'date', label: 'Dato'},
    {key: 'doneBy', label: 'Utført av'},
    {key: 'eventType', label: 'Hendelsestype'},
    {key: 'keyData', label: 'Nøkkeldata'},
    {key: 'note', label: 'Kommentar'}
  ];
  return (
    <Table
      className="table"
      columns={cols}>
      {events && events.map((e) => (
        <Tr><Td>{e.date}</Td> <Td>{e.doneBy}</Td><Td>{e.eventType}</Td><Td>{e.keyData}</Td><Td>{e.note}</Td></Tr>)
      )}
    </Table>
  );
};

type SampleTypeProps = { samples: T_Samples };
const SampleTable = ({ samples }: SampleTypeProps) => {
  const cols = [
    {key: 'sampleId', label: 'Prøve-ID'},
    {key: 'doneBy', label: 'Utført av'},
    {key: 'date', label: 'Dato'},
    {key: 'sampleType', label: 'Prøvetype'},
    {key: 'sampleSubType', label: 'Prøveundertype'},
    {key: 'status', label: 'Status'}
  ];
  return (
    <Table
      className="table"
      columns={cols}>
      {samples && samples.map((e) => (
        <Tr><Td>{e.sampleId}</Td> <Td>{e.doneBy}</Td><Td>{e.date}</Td><Td>{e.sampleType}</Td><Td>{e.sampleSubType}</Td>
        <Td>{e.status}</Td></Tr>)
      )}
    </Table>
  );
};

type ViewObjectComponentProps = { objectData: T_ObjectData, events: T_Events, samples: T_Samples }
export const ViewObjectComponent = ({ objectData, events, samples }: ViewObjectComponentProps) => {
  return (
    <div>
      <h1>Objektvisning</h1>
      <Row>
        <Col>{objectData.museumNo}</Col>
        <Col>djfkdfjkdj</Col>
        <Col>dkfdlfkdl</Col>
      </Row>
      <Row>
        <Col>dlfdlfk</Col>
        <Col>djfkdfjkdj</Col>
        <Col>dkfdlfkdl</Col>
      </Row>
      <Tabs>
        <Tab title="Hendelser">
          <EventTable events={events} >

          </EventTable>
        </Tab>
        <Tab title="Relaterte objekter">
          <SampleTable samples={samples}>

          </SampleTable>
        </Tab>
      </Tabs>
    </div>
  );

};

