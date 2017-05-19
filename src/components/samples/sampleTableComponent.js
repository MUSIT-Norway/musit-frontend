// @flow
import React from 'react';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';
import type { SamplesPropsType } from '../../types/samples';

const SampleTableComponent = ({ samples, onClick }: SamplesPropsType) => {
  return (
    <div>
      <Table
        className="table"
        columns={[
          { key: 'id', label: 'Sample ID' },
          { key: 'doneDate', label: 'Dato' },
          { key: 'sampleType', label: 'Prøvetype' },
          { key: 'sampleSubType', label: 'Prøveundertype' },
          { key: 'status', label: 'Status' },
          { key: 'hasAnalyse', label: 'Analyse' },
          { key: 'showInfo', label: 'Vis detaljer' }
        ]}
        sortable={['id', 'date']}
        noDataText={I18n.t('musit.samples.noSamplesForObject')}
      >
        {samples &&
          samples.map((e, i) => (
            <Tr key={i}>
              <Td column="id">{e.id}</Td>
              <Td column="doneDate">{e.doneDate.format('DD.MM.YYYY')}</Td>
              <Td column="sampleType">{e.sampleTypeId}</Td>
              <Td column="sampleSubType">{' '}</Td>
              <Td column="status">{e.status}</Td>
              <Td column="hasAnalyse">{e.hasAnalyse}</Td>
              <Td column="showInfo">
                <a onClick={() => onClick(e)}>Se mer / Rediger</a>
              </Td>
            </Tr>
          ))}
      </Table>
    </div>
  );
};

export default SampleTableComponent;
