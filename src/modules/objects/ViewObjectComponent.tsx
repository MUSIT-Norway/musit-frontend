// @flow
import * as React from 'react';
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
import { ObjectData } from '../../types/object';
import { Samples, SampleStatus, SampleData } from '../../types/samples';
import { Events } from '../../types/events';
import { AnalysisTypesObject } from '../../types/analysis';
import { SampleTypesObject } from '../../types/sample';
import EventTable from '../events/components/EventTable';
import { PredefinedConservation } from '../../types/predefinedConservation';
import SampleTable from '../sample/components/SampleTable';
import ViewObjectData from './components/ViewObjectData';
import Config from '../../config';
import { AppSession } from '../../types/appSession';
//import { History } from 'types/Routes';
import { History } from 'history';
import { I18n } from 'react-i18nify';
import { TODO } from '../../types/common';

type ViewObjectComponentProps = {
  objectStore: { objectData: ObjectData; events: Events; samples: Samples };
  appSession: AppSession;
  analysisTypes: AnalysisTypesObject;
  sampleTypes: SampleTypesObject;
  predefinedConservation: PredefinedConservation;
  pickObject: Function;
  isItemAdded: Function;
  pickList: Object;
  sampleStatus: SampleStatus;
  history: History;
  loading: boolean;
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
            onClick={(event: TODO) => {
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
            onClick={(sample: SampleData) => {
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
