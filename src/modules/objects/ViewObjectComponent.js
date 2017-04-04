
import React from 'react';
import {Row, Col, Tabs, Tab} from 'react-bootstrap';
import type { T_ObjectData } from '../../types/object';
import type { T_Samples } from '../../types/samples';
import type { T_Events } from  '../../types/events';
import EventTableComponent from '../../components/events/eventTableComponent';
import SampleTableComponent from '../../components/samples/sampleTableComponent';


type ViewObjectComponentProps = { objectData: T_ObjectData, events: T_Events, samples: T_Samples };

export const ViewObjectComponent = ({ objectData, events, samples }: ViewObjectComponentProps) => {
  return (
    <div>
      <h1>Objektvisning</h1>
      <Row>
        <Col>{objectData && objectData.museumNo}</Col>
        <Col>djfkdfjkdj</Col>
        <Col>dkfdlfkdl</Col>
      </Row>
      <Row>
        <Col>dlfdlfk</Col>
        <Col>djfkdfjkdj</Col>
        <Col>dkfdlfkdl</Col>
      </Row>
      <Tabs id = "objectDetails">
        <Tab
          title="Hendelser"
          eventKey={0} id="1">
          <EventTableComponent events={events} />
        </Tab>
        <Tab title="Relaterte objekter" eventKey={1} id="2">
          <SampleTableComponent samples={samples}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ViewObjectComponent;



