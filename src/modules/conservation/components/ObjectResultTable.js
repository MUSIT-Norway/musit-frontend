// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import './ObjectResultTable.css';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import FontAwesome from 'react-fontawesome';
import MusitI18n from '../../../components/MusitI18n';
import type { ObjectData } from '../../../types/object';

type Props = {
  data: Array<ObjectData & { expanded: boolean }>,
  handleClickRow: (object: Object) => void,
  updateForm?: Function,
  extraAttributes?: *,
  history: History,
  appSession: AppSession,
  viewMode?: ?boolean
};

export default function ObjectResultTable({
  data,
  handleClickRow,
  extraAttributes,
  updateForm,
  history,
  appSession,
  viewMode
}: Props) {
  const enableResultForObject = true;
  return (
    <table
      style={{
        backgroundColor: 'white'
      }}
      className="table table-bordered table-striped table-responsive"
    >
      <thead>
        <tr>
          <th> </th>
          <th>{I18n.t('musit.objects.objectsView.musNo')}</th>
          <th>{I18n.t('musit.objects.objectsView.subNo')}</th>
          <th>{I18n.t('musit.analysis.term')}</th>
          <th width={10}> </th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          data.map((row, i) => {
            const rows = [
              <tr
                key={['objectRow', i].join('_')}
                onClick={() => enableResultForObject && handleClickRow(row)}
                className={row.expanded ? 'expanded-row' : 'collapsed-row'}
              >
                <td name="type" width={10}>
                  <span className="icon icon-musitobject" />
                </td>
                <td name="museumNo">{row.museumNo}</td>
                <td name="subNo">{row.subNo}</td>
                <td name="term">{row.term}</td>
                <td>
                  {enableResultForObject &&
                    (row.expanded ? (
                      <FontAwesome name="chevron-down" />
                    ) : (
                      <FontAwesome name="chevron-up" />
                    ))}
                </td>
              </tr>
            ];
            if (row.expanded) {
              return [
                ...rows,
                <tr key={['objectResult', i].join('_')} className="expanded-row-dropdown">
                  <td colSpan={7}>
                    <div>Her kommer objektvisning</div>
                  </td>
                </tr>
              ];
            }
            return rows;
          })
        ) : (
          <span className="no-data">{I18n.t('musit.objects.noData')}</span>
        )}
      </tbody>
    </table>
  );
}

const getRawValue = value =>
  value && value.rawValue && value.rawValue.length > 0
    ? value.rawValue
    : value && value.value && value.value.toString().replace('.', ',');
