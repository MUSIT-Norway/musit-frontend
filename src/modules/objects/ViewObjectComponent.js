// @flow
import React from 'react';
import {
  Tabs,
  Tab,
  PageHeader,
  DropdownButton,
  MenuItem,
  Row,
  Col,
  ControlLabel
} from 'react-bootstrap';
import type { ObjectData } from '../../types/object';
import type { Samples, SampleStatus } from '../../types/samples';
import type { Events } from '../../types/events';
import type { AnalysisTypesObject } from '../../types/analysis';
import type { SampleTypesObject } from '../../types/sample';
import EventTable from '../events/components/EventTable';
import type { PredefinedConservation } from '../../types/predefinedConservation';
import SampleTable from '../sample/components/SampleTable';
import ViewObjectData from './components/ViewObjectData';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { History } from 'types/Routes';
import { I18n } from 'react-i18nify';

type ViewObjectComponentProps = {
  objectStore: { objectData: ObjectData, events: Events, samples: Samples },
  appSession: AppSession,
  analysisTypes: AnalysisTypesObject,
  sampleTypes: SampleTypesObject,
  predefinedConservation: PredefinedConservation,
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
  predefinedConservation,
  pickObject,
  isItemAdded,
  pickList,
  sampleStatus,
  history,
  loading
}: ViewObjectComponentProps) =>
  !loading ? (
    <div className="container">
      <PageHeader>{I18n.t('musit.objects.objectsView.objectView')}</PageHeader>
      <ViewObjectData objectData={objectData} />

      {appSession.rolesForModules.collectionManagementWrite && (
        <Row>
          <Col md={2} style={{ paddingTop: '5px' }}>
            <ControlLabel>
              {I18n.t('musit.objects.objectsView.createNewEvent')}
            </ControlLabel>
          </Col>
          <Col md={3}>
            <DropdownButton
              title={I18n.t('musit.objects.objectsView.selectEvent')}
              id="bg-nested-dropdown"
            >
              <MenuItem
                eventKey="newAnalysis"
                onClick={() =>
                  history.push({
                    pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
                    state: [{ objectData }]
                  })
                }
              >
                {I18n.t('musit.objects.objectsView.newAnalysis')}
              </MenuItem>
              {
                // hide for Archaeology & Ethnography collections
                //appSession &&
                //appSession.collectionId !== '2e4f2455-1b3b-4a04-80a1-ba92715ff613' &&
                //appSession.collectionId !== '88b35138-24b5-4e62-bae4-de80fae7df82' &&
                <MenuItem
                  eventKey="newSample"
                  onClick={() =>
                    history.push({
                      pathname: Config.magasin.urls.client.analysis.addSample(
                        appSession,
                        objectData.uuid
                      )
                    })
                  }
                >
                  {I18n.t('musit.objects.objectsView.newSample')}
                </MenuItem>
              }
              <MenuItem
                eventKey="newConservation"
                onClick={() =>
                  history.push({
                    pathname: Config.magasin.urls.client.conservation.addConservation(
                      appSession
                    ),
                    state: [objectData]
                  })
                }
              >
                {I18n.t('musit.conservation.newConservation')}
              </MenuItem>
            </DropdownButton>
          </Col>
        </Row>
      )}
      <hr />
      <Tabs defaultActiveKey={1} id="events">
        <Tab title={I18n.t('musit.objects.objectsView.events.events')} eventKey={1}>
          <EventTable
            events={events}
            analysisTypes={analysisTypes}
            sampleTypes={sampleTypes}
            conservationTypes={
              predefinedConservation && predefinedConservation.conservationTypes
                ? predefinedConservation.conservationTypes
                : []
            }
            appSession={appSession}
            onClick={event => {
              if (event.type === 'Analysis' || event.type === 'AnalysisCollection') {
                history.push({
                  pathname: Config.magasin.urls.client.analysis.viewAnalysis(
                    appSession,
                    event.id
                  )
                });
              } else if (event.type === 'Conservation') {
                history.push({
                  pathname: Config.magasin.urls.client.conservation.viewConservation(
                    appSession,
                    event.eventId
                  )
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
                )
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
  ) : (
    <div className="loading" />
  );

export default ViewObjectComponent;
