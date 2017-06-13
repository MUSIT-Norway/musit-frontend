import React from 'react';
import Fontawesome from 'react-fontawesome';
import { Table, Tr, Td } from 'reactable';
import { I18n } from 'react-i18nify';

export default function ObjectTable({ objects }) {
  return (
    <Table
      style={{
        backgroundColor: 'white'
      }}
      id="objects"
      className="table"
      columns={[
        { key: 'type', label: '' },
        { key: 'museumNo', label: I18n.t('musit.analysis.museumNumber') },
        { key: 'subNo', label: I18n.t('musit.analysis.underNumber') },
        { key: 'term', label: I18n.t('musit.analysis.term') },
        { key: 'sampleNum', label: I18n.t('musit.analysis.sampleNumber') },
        { key: 'sampleType', label: I18n.t('musit.analysis.sampleType') }
      ]}
      sortable={['museumNumber', 'subNumber', 'term']}
    >
      {objects.length > 0
        ? objects.map((event, i) => (
            <Tr key={i}>
              <Td column="type" width="5">
                {event.sampleNum
                  ? <Fontawesome name="flask" />
                  : <span className="icon icon-musitobject" />}
              </Td>
              <Td column="museumNo">{event.museumNo || ''}</Td>
              <Td column="subNo">{event.subNo || ''}</Td>
              <Td column="term">{event.term}</Td>
              <Td column="sampleNum"><span>{event.sampleNum || ''}</span></Td>
              <Td column="sampleType">
                {event.sampleType ? event.sampleType + ' / ' + event.sampleSubType : ''}
              </Td>
            </Tr>
          ))
        : <span className="no-data">{I18n.t('musit.objects.noData')}</span>}
    </Table>
  );
}
