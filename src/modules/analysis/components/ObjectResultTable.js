// @flow
import React from 'react';
import Fontawesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import './ObjectResultTable.css';
import Result from '../components/Result';

type Props = {
  data: Array<Object>,
  handleClickRow: (object: Object) => void,
  updateForm?: Function
};

export default function ObjectResultTable({ data, handleClickRow, updateForm }: Props) {
  return (
    <table
      style={{
        backgroundColor: 'white'
      }}
      className="table table-bordered table-striped table-responsive"
    >
      <thead>
        <tr>
          <th>{' '}</th>
          <th>Museumnr</th>
          <th>Unr</th>
          <th>Term/artsnavn</th>
          <th>Prøvenr</th>
          <th>Prøvetype</th>
          <th width={10}>{' '}</th>
        </tr>
      </thead>
      <tbody>
        {data
          ? data.map((row, i) => {
              const rows = [
                <tr
                  key={['objectRow', i].join('_')}
                  onClick={() => handleClickRow(row)}
                  className={row.expanded ? 'expanded-row' : 'collapsed-row'}
                >
                  <td name="type" width={10}>
                    {row.sampleNum
                      ? <Fontawesome name="flask" />
                      : <span className="icon icon-musitobject" />}
                  </td>
                  <td name="museumNo">{row.museumNo || ''}</td>
                  <td name="subNo">{row.subNo || ''}</td>
                  <td name="term">{row.term}</td>
                  <td name="sampleNum"><span>{row.sampleNum || ''}</span></td>
                  <td name="sampleType">
                    {row.sampleType ? row.sampleType + ' / ' + row.sampleSubType : ''}
                  </td>
                  <td>{row.expanded ? '^' : '>'}</td>
                </tr>
              ];
              if (row.expanded) {
                return [
                  ...rows,
                  <tr
                    key={['objectResult', i].join('_')}
                    className="expanded-row-dropdown"
                  >
                    <td colSpan={7}>
                      <Result
                        externalSource={
                          row.result.extRef ? row.result.extRef.join(',') : ''
                        }
                        updateExternalSource={extRef => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: {
                              ...row.result,
                              extRef: extRef.split(',').map(v => v.trim())
                            }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        comments={row.result.comment}
                        updateComments={comment => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, comment }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                      />
                    </td>
                  </tr>
                ];
              }
              return rows;
            })
          : <span className="no-data">{I18n.t('musit.objects.noData')}</span>}
      </tbody>
    </table>
  );
}
