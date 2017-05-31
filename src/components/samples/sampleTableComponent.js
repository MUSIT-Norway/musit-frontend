// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { SamplesPropsType } from '../../types/samples';

const SampleTableComponent = ({ samples, onClick }: SamplesPropsType) => {
  return (
    <div>
      <Table
        className="table table-hover table-inverse table-responsive"
        columns={[
          { key: 'registeredDate', label: 'Dato' },
          { key: 'sampleType', label: 'Prøvetype' },
          { key: 'sampleSubType', label: 'Prøveundertype' },
          { key: 'status', label: 'Status' },
          { key: 'hasAnalyse', label: 'Analyse' },
          { key: 'sampleNum', label: 'Prøvenr' },
          { key: 'storageMedium', label: 'Lagringsmedium' }
        ]}
        sortable={['id', 'date']}
        noDataText={I18n.t('musit.samples.noSamplesForObject')}
      >
        {samples &&
          samples.map((e, i) => (
            <Tr key={i} onClick={() => onClick(e)}>
              <Td column="registeredDate">{e.registeredDate}</Td>
              <Td column="sampleType">{e.sampleTypeId}</Td>
              <Td column="sampleSubType">{' '}</Td>
              <Td column="status">{e.status}</Td>
              <Td column="hasAnalyse">{e.hasAnalyse}</Td>
              <Td column="sampleNum">{e.sampleNum}</Td>
              <Td column="storageMedium">{e.storageMedium}</Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};

export default SampleTableComponent;
