// @flow
import * as React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import {
  Samples,
  SampleData,
  SampleStatus,
  SampleStatusData
} from '../../../types/samples';
import { SampleTypesObject } from '../../../types/sample';
import * as FontAwesome from 'react-fontawesome';
import { AppSession } from '../../../types/appSession';
import { ObjectData } from '../../../types/object';
import { flattenSample } from '../shared/types';
import { omit } from 'lodash';
import { getSampleType, getSampleSubType } from '../shared/types';
import { Maybe } from '../../../types/common';
import { PicklistData } from '../../../types/picklist';

type Props = {
  samples: Samples;
  onClick: Function;
  pickObject: Function;
  isItemAdded: Function;
  pickList: PicklistData;
  appSession: AppSession;
  objectData: ObjectData;
  sampleTypes: SampleTypesObject;
  sampleStatus: SampleStatus;
};

const pickObjectParams = (
  sampleData: SampleData,
  appSession: AppSession,
  objectData: ObjectData,
  sampleTypes: SampleTypesObject
) => {
  return {
    object: flattenSample(
      appSession,
      sampleTypes.sampleTypes,
      omit(objectData, 'sampleData'),
      sampleData
    )
  };
};
const getSampleStatus = (
  sampleStatus: SampleStatus,
  statusId: number,
  appSession: AppSession
) => {
  if (sampleStatus && statusId) {
    const sampleStatusFound: Maybe<SampleStatusData> = sampleStatus.find(
      f => f.id === statusId
    );
    if (sampleStatusFound) {
      return appSession.language.isEn
        ? sampleStatusFound.enStatus
        : sampleStatusFound.noStatus;
    }
  }
  return '';
};

const SampleTableComponent = ({
  samples,
  onClick,
  pickObject,
  isItemAdded,
  pickList,
  appSession,
  objectData,
  sampleTypes,
  sampleStatus
}: Props) => {
  return (
    <div>
      <Table
        className="table table-hover table-inverse table-responsive"
        columns={[
          {
            key: 'sampleNum',
            label: I18n.t('musit.objects.objectsView.samples.sampleNumber')
          },
          {
            key: 'registeredDate',
            label: I18n.t('musit.objects.objectsView.samples.date')
          },
          {
            key: 'sampleType',
            label: I18n.t('musit.objects.objectsView.samples.sampleType')
          },
          {
            key: 'sampleSubType',
            label: I18n.t('musit.objects.objectsView.samples.sampleSubType')
          },
          { key: 'status', label: I18n.t('musit.objects.objectsView.samples.status') },
          {
            key: 'hasAnalyse',
            label: I18n.t('musit.objects.objectsView.samples.analysis')
          },
          {
            key: 'storageMedium',
            label: I18n.t('musit.objects.objectsView.samples.storageMedia')
          },
          {
            key: 'add',
            label: (
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  samples.map(obj =>
                    pickObject(pickObjectParams(obj, appSession, objectData, sampleTypes))
                  );
                }}
                title={I18n.t('musit.objectsearch.addAllToPickList')}
              >
                <FontAwesome style={{ fontSize: '1.3em' }} name="shopping-cart" />
              </a>
            )
          }
        ]}
        sortable={['id', 'date']}
        noDataText={I18n.t('musit.samples.noSamplesForObject')}
      >
        {samples &&
          samples.map((s, i) => (
            <Tr key={i} onClick={() => onClick(s)}>
              <Td column="sampleNum">{s.sampleNum || ''}</Td>
              <Td column="registeredDate">{s.registeredDate || ''}</Td>
              <Td column="sampleType">
                {getSampleType(sampleTypes, s.sampleTypeId, appSession) || ''}
              </Td>
              <Td column="sampleSubType">
                {getSampleSubType(sampleTypes, s.sampleTypeId, appSession) || ''}
              </Td>
              <Td column="status">
                {getSampleStatus(sampleStatus, s.status, appSession) || ''}
              </Td>
              <Td column="hasAnalyse">{s.hasAnalyse || ''}</Td>
              <Td column="storageMedium">{s.storageMedium || ''}</Td>
              <Td column="add">
                <a
                  onClick={e => {
                    pickObject(pickObjectParams(s, appSession, objectData, sampleTypes));
                    e.stopPropagation();
                  }}
                  title={I18n.t('musit.objectsearch.addToPickList')}
                >
                  {isItemAdded({ ...s, id: s.objectId }, pickList.objects) ? (
                    <FontAwesome
                      style={{ fontSize: '1.3em', color: 'Gray' }}
                      name="shopping-cart"
                    />
                  ) : (
                    <FontAwesome style={{ fontSize: '1.3em' }} name="shopping-cart" />
                  )}
                </a>
              </Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};

export default SampleTableComponent;
