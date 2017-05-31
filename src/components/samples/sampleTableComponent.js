// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { Samples, SampleData } from '../../types/samples';
import FontAwesome from 'react-fontawesome';
import type { AppSession } from '../../types/appSession';
import type { ObjectData } from '../../types/object';

type Props = {
  samples: Samples,
  onClick: Function,
  pickObject: Function,
  isItemAdded: Function,
  pickList: Object,
  appSession: AppSession,
  objectData: ObjectData
};

const pickObjectParams = (
  s: SampleData,
  appSession: AppSession,
  objectData: ObjectData
) => {
  return {
    object: {
      ...s,
      uuid: s.objectId,
      collection: appSession.collectionId,
      id: s.objectId,
      museumNo: objectData.museumNo,
      objectType: s.sampleTypeId,
      subNo: objectData.subNo,
      term: objectData.term,
      type: 'sample'
    },
    breadcrumb: s.breadcrumb ? s.breadcrumb : {},
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
};
const SampleTableComponent = ({
  samples,
  onClick,
  pickObject,
  isItemAdded,
  pickList,
  appSession,
  objectData
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
                    pickObject(pickObjectParams(obj, appSession, objectData))
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
              <Td column="sampleNum">{s.sampleNum}</Td>
              <Td column="registeredDate">{s.registeredDate}</Td>
              <Td column="sampleType">{s.sampleTypeId}</Td>
              <Td column="sampleSubType">{' '}</Td>
              <Td column="status">{s.status}</Td>
              <Td column="hasAnalyse">{s.hasAnalyse}</Td>
              <Td column="storageMedium">{s.storageMedium}</Td>
              <Td column="add">
                <a
                  onClick={e => {
                    pickObject(pickObjectParams(s, appSession, objectData));
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
