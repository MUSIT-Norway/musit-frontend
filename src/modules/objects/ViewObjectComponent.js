// @flow
import React from 'react';
import { Row, Col, Tabs, Tab, PageHeader, Button } from 'react-bootstrap';
import type { ObjectData } from '../../types/object';
import type { Samples, SampleStatus } from '../../types/samples';
import type { Events } from '../../types/events';
import type { AnalysisTypesObject } from '../../types/analysisTypes';
import type { SampleTypesObject } from '../../types/sampleTypes';
import EventTable from '../events/components/EventTable';
import SampleTable from '../sample/components/SampleTable';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { History } from 'types/Routes';
import { I18n } from 'react-i18nify';

type ViewObjectComponentProps = {
  objectStore: { objectData: ObjectData, events: Events, samples: Samples },
  appSession: AppSession,
  analysisTypes: AnalysisTypesObject,
  sampleTypes: SampleTypesObject,
  pickObject: Function,
  isItemAdded: Function,
  pickList: Object,
  sampleStatus: SampleStatus,
  history: History,
  loading: boolean
};

export const ViewObjectComponent = ({
  objectStore: { objectData, events, samples },
  appSession,
  analysisTypes,
  sampleTypes,
  pickObject,
  isItemAdded,
  pickList,
  sampleStatus,
  history,
  loading
}: ViewObjectComponentProps) =>
  !loading
    ? <div className="container">
        <PageHeader>{I18n.t('musit.objects.objectsView.objectView')}</PageHeader>
        <div style={{ marginTop: '30px', marginBottom: '40px' }}>
          <Row>
            <Col md={2}>
              <b>{I18n.t('musit.analysis.museumNumber')}:</b>
              {' '}
              {objectData && objectData.museumNo}
            </Col>
            <Col md={1}>
              <b>{I18n.t('musit.analysis.underNumber')}:</b>
              {' '}
              {objectData && objectData.subNo}
            </Col>
            <Col md={3}>
              <b>{I18n.t('musit.analysis.term')}:</b>{' '}{objectData && objectData.term}
            </Col>
          </Row>
        </div>
        <div style={{ paddingBottom: 10 }}>
          <Button
            className="primary"
            onClick={() =>
              history.push({
                pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
                state: [objectData]
              })}
          >
            {I18n.t('musit.objects.objectsView.newAnalysis')}
          </Button>
          <Button
            className="primary"
            onClick={() =>
              history.push({
                pathname: Config.magasin.urls.client.analysis.addSample(
                  appSession,
                  objectData.uuid
                ),
                state: [objectData]
              })}
          >
            {I18n.t('musit.objects.objectsView.newSample')}
          </Button>
        </div>
        <Tabs defaultActiveKey={1} id="events">
          <Tab title={I18n.t('musit.objects.objectsView.events.events')} eventKey={1}>
            <EventTable
              events={events}
              analysisTypes={analysisTypes}
              sampleTypes={sampleTypes}
              appSession={appSession}
              onClick={event => {
                if (event.type === 'Analysis' || event.type === 'AnalysisCollection') {
                  history.push({
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
          <Tab title={I18n.t('musit.objects.objectsView.samples.samples')} eventKey={2}>
            <SampleTable
              samples={samples}
              onClick={sample => {
                history.push({
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
              sampleStatus={sampleStatus}
            />
          </Tab>
        </Tabs>
      </div>
    : <div className="loading" />;

export default ViewObjectComponent;
