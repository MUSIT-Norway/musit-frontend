// @flow
import * as React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import { Event, Events } from '../../../types/events';

import {
  AnalysisTypesObject,
  AnalysisTypes,
  AnalysisType
} from '../../../types/analysis';
import { SampleTypesObject } from '../../../types/sample';
import { AppSession } from '../../../types/appSession';
import { getSampleType, getSampleSubType } from '../../sample/shared/types';
import { ConservationTypes } from '../../../types/conservation';
import { TODO, Maybe } from '../../../types/common';

type EventTypeProps = {
  events: Events;
  onClick: Function;
  analysisTypes: AnalysisTypesObject;
  sampleTypes: SampleTypesObject;
  conservationTypes?: ConservationTypes;
  appSession: AppSession;
};

//TODO move it to utils
function toPathStr(pathArr: TODO[], crumb = 0) {
  return pathArr
    .slice(crumb)
    .map(o => o.name)
    .join('  /  ');
}

function getPathDotsAndToolTip(pathArr: TODO[]) {
  return pathArr.length > 2 ? (
    <div title={toPathStr(pathArr)} data-toggle="popover" data-trigger="hover">
      {'.../' + toPathStr(pathArr, -3)}
    </div>
  ) : (
    toPathStr(pathArr)
  );
}

function getKeyData(
  event: Event,
  analysisTypes: AnalysisTypes,
  sampleTypes: SampleTypesObject,
  //  conservationTypes?: ConservationTypes,
  appSession: AppSession
) {
  if (event.type) {
    if (event.type === 'Conservation') {
      return appSession.language.isEn
        ? (event.enKeyData || []).join('/ ')
        : (event.noKeyData || []).join('/ ');
    }
    if (
      (event.type === 'AnalysisCollection' || event.type === 'Analysis') &&
      analysisTypes
    ) {
      const analysisTypeFound = analysisTypes.find(
        f => !!(f.id && f.id === event.analysisTypeId)
      );
      if (analysisTypeFound) {
        return appSession.language.isEn
          ? analysisTypeFound.enName
          : analysisTypeFound.noName;
      }
    }
    if (event.type === 'MoveObject') {
      return getPathDotsAndToolTip(event.to.breadcrumb);
    }
    if (event.type === 'SampleCreated' && event.sampleTypeId && sampleTypes) {
      const sampleType: string = getSampleType(
        sampleTypes,
        event.sampleTypeId,
        appSession
      );
      const sampleSubType: string = getSampleSubType(
        sampleTypes,
        event.sampleTypeId,
        appSession
      );
      return sampleSubType ? `${sampleType} / ${sampleSubType}` : sampleType;
    }
  }
  return '';
}

export const EventTableComponent = ({
  events,
  onClick,
  analysisTypes,
  sampleTypes,
  //conservationTypes,
  appSession
}: EventTypeProps) => {
  return (
    <div>
      <Table
        className="table table-hover table-inverse table-responsive"
        columns={[
          { key: 'doneDate', label: I18n.t('musit.objects.objectsView.events.doneDate') },
          { key: 'type', label: I18n.t('musit.objects.objectsView.events.eventType') },
          {
            key: 'doneBy',
            label: I18n.t('musit.objects.objectsView.events.performedBy')
          },
          { key: 'keyData', label: I18n.t('musit.objects.objectsView.events.keyData') },
          {
            key: 'caseNumber',
            label: I18n.t('musit.objects.objectsView.events.caseNumber')
          }
        ]}
        sortable={['id', 'type', 'eventDate', 'registeredBy', 'note']}
        noDataText={I18n.t('musit.events.noDataForObject')}
      >
        {events &&
          events.map((event, i) => (
            <Tr key={i} onClick={() => onClick(event)}>
              <Td column="doneDate">
                {event.type && event.type === 'MoveObject' ? (
                  event.doneDate
                ) : (
                  event.registeredDate
                )}
              </Td>
              <Td column="type">
                {event.type ? (
                  I18n.t(`musit.objects.objectsView.eventTypes.${event.type}`)
                ) : (
                  ''
                )}
              </Td>
              <Td column="doneBy">
                {event.type && event.type === 'MoveObject' ? (
                  event.doneBy
                ) : (
                  event.registeredBy
                )}
              </Td>
              <Td column="keyData">
                {getKeyData(
                  event,
                  analysisTypes.analysisTypes,
                  sampleTypes,
                  //                  conservationTypes,
                  appSession
                )}
              </Td>
              <Td column="caseNumber">
                {event.caseNumbers ? (
                  event.caseNumbers.join('; ')
                ) : event.caseNumber ? (
                  event.caseNumber
                ) : (
                  ''
                )}
              </Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};
(EventTableComponent as TODO).displayName = 'EventTableComponent';
export default EventTableComponent;
