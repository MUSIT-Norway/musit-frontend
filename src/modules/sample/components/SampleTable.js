// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type {
  Samples,
  SampleData,
  SampleStatus,
  SampleStatusData
} from '../../../types/samples';
import type { SampleTypesObject } from '../../../types/sampleTypes';
import FontAwesome from 'react-fontawesome';
import type { AppSession } from '../../../types/appSession';
import type { ObjectData } from '../../../types/object';
import { getSampleType, getSampleSubType } from '../shared/types';

type Props = {
  samples: Samples,
  onClick: Function,
  pickObject: Function,
  isItemAdded: Function,
  pickList: Object,
  appSession: AppSession,
  objectData: ObjectData,
  sampleTypes: SampleTypesObject,
  sampleStatus: SampleStatus
};

const pickObjectParams = (
  s: SampleData,
  appSession: AppSession,
  objectData: ObjectData,
  sampleTypes: SampleTypesObject
) => {
  return {
    object: {
      ...s,
      uuid: s.objectId,
      collection: appSession.collectionId,
      id: s.objectId,
      museumNo: objectData.museumNo,
      objectType: 'sample',
      subNo: objectData.subNo,
      term: objectData.term,
      sampleType: getSampleType(sampleTypes, s.sampleTypeId, appSession),
      sampleSubType: getSampleSubType(sampleTypes, s.sampleTypeId, appSession)
    },
    breadcrumb: s.breadcrumb ? s.breadcrumb : [],
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
};
const getSampleStatus = (
  sampleStatus: SampleStatus,
  statusId: number,
  appSession: AppSession
) => {
  if (sampleStatus && statusId) {
    const sampleStatusFound: ?SampleStatusData = sampleStatus.find(
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
          { key: 'sampleNum', label: 'Prøvenr' },
          { key: 'registeredDate', label: 'Dato' },
          { key: 'sampleType', label: 'Prøvetype' },
          { key: 'sampleSubType', label: 'Prøveundertype' },
          { key: 'status', label: 'Status' },
          { key: 'hasAnalyse', label: 'Analyse' },
          { key: 'storageMedium', label: 'Lagringsmedium' },
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
                  {isItemAdded({ ...s, id: s.objectId }, pickList.objects)
                    ? <FontAwesome
                        style={{ fontSize: '1.3em', color: 'Gray' }}
                        name="shopping-cart"
                      />
                    : <FontAwesome style={{ fontSize: '1.3em' }} name="shopping-cart" />}
                </a>
              </Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};

export default SampleTableComponent;