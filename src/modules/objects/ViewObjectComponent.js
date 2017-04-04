/* @flow */
import React from 'react';
import {Row, Col, Tabs, Tab, PageHeader} from 'react-bootstrap';
import type { T_ObjectData } from '../../types/object';
import type { T_Samples } from '../../types/samples';
import type { T_Events } from  '../../types/events';
import EventTableComponent from '../../components/events/eventTableComponent';
import SampleTableComponent from '../../components/samples/sampleTableComponent';


type ViewObjectComponentProps = { objectStore: {objectData: T_ObjectData, events: T_Events, samples: T_Samples} };

export const ViewObjectComponent = ({ objectStore: {objectData, events, samples }}: ViewObjectComponentProps) => {
  console.log(objectData);
  return (
    <div>
      <PageHeader>Objektvisning</PageHeader>
      <div style={{marginTop: '30px', marginBottom: '40px'}}>
        <Row>
          <Col md={2}><b>Museumsnr:</b>{' '}{objectData && objectData.museumNo}</Col>
          <Col md={1}><b>Unr:</b>{' '}{objectData && objectData.subNo}</Col>
          <Col md={3}><b>Term/artsnavn:</b>{' '}{objectData && objectData.term}</Col>
        </Row>
      </div>
      <Tabs id="objectDetails">
        <Tab
          title="Hendelser"
          eventKey={0} id="1">
          <EventTableComponent events={events} />
        </Tab>
        <Tab title="Prøver" eventKey={1} id="2">
          <SampleTableComponent samples={samples}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ViewObjectComponent;



