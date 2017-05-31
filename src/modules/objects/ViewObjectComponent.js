// @flow
import React from 'react';
import { Row, Col, Tabs, Tab, PageHeader, Button } from 'react-bootstrap';
import type { ObjectData } from '../../types/object';
import type { Samples } from '../../types/samples';
import type { Events } from '../../types/events';
import type { AnalysisTypesObject } from '../../types/analysisTypes';
import type { SampleTypesObject } from '../../types/sampleTypes';
import EventTableComponent from '../../components/events/eventTableComponent';
import SampleTableComponent from '../../components/samples/sampleTableComponent';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';

type ViewObjectComponentProps = {
  objectStore: { objectData: ObjectData, events: Events, samples: Samples },
  appSession: AppSession,
  analysisTypes: AnalysisTypesObject,
  sampleTypes: SampleTypesObject,
  pickObject: Function,
  isItemAdded: Function,
  pickList: Object
};

export const ViewObjectComponent = ({
  objectStore: { objectData, events, samples },
  appSession,
  analysisTypes,
  sampleTypes,
  pickObject,
  isItemAdded,
  pickList
}: ViewObjectComponentProps) => (
  <div>
    <PageHeader>Objektvisning</PageHeader>
    <div style={{ marginTop: '30px', marginBottom: '40px' }}>
      <Row>
        <Col md={2}><b>Museumsnr:</b>{' '}{objectData && objectData.museumNo}</Col>
        <Col md={1}><b>Unr:</b>{' '}{objectData && objectData.subNo}</Col>
        <Col md={3}><b>Term/artsnavn:</b>{' '}{objectData && objectData.term}</Col>
      </Row>
    </div>
    <div style={{ paddingBottom: 10 }}>
      <Button
        className="primary"
        onClick={() =>
          hashHistory.push({
            pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
            state: [objectData]
          })}
      >
        Ny analyse
      </Button>
      <Button
        className="primary"
        onClick={() =>
          hashHistory.push({
            pathname: Config.magasin.urls.client.analysis.addSample(
              appSession,
              objectData.uuid
            ),
            state: [objectData]
          })}
      >
        Ny prøve
      </Button>
    </div>
    <Tabs defaultActiveKey={1} id="events">
      <Tab title="Hendelser" eventKey={1}>
        <EventTableComponent
          events={events}
          analysisTypes={analysisTypes}
          sampleTypes={sampleTypes}
          appSession={appSession}
          onClick={event => {
            if (event.type === 'Analysis' || event.type === 'AnalysisCollection') {
              hashHistory.push({
                pathname: Config.magasin.urls.client.analysis.viewAnalysis(
                  appSession,
                  event.id
                ),
                state: [objectData]
              });
            }
          }}
        />
      </Tab>
      <Tab title="Prøver" eventKey={2}>
        <SampleTableComponent
          samples={samples}
          onClick={sample => {
            hashHistory.push({
              pathname: Config.magasin.urls.client.analysis.gotoSample(
                appSession,
                sample.objectId
              ),
              state: [objectData]
            });
          }}
          pickObject={pickObject}
          isItemAdded={isItemAdded}
          pickList={pickList}
          appSession={appSession}
          objectData={objectData}
          sampleTypes={sampleTypes}
        />
      </Tab>
    </Tabs>
  </div>
);

export default ViewObjectComponent;
