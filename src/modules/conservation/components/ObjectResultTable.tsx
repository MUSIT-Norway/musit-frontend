// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import * as FontAwesome from 'react-fontawesome';
import { ObjectData } from '../../../types/object';
import ViewOjectData from '../../objects/components/ViewObjectData';
import { Star, Maybe } from '../../../types/common';
import { styleWidth10 } from '../../../shared/util';

type Props = {
  data: Array<ObjectData & { expanded: boolean }>;
  handleClickRow: (object: Object) => void;
  updateForm?: Function;
  extraAttributes?: Star;
  history: History;
  appSession: AppSession;
  viewMode?: Maybe<boolean>;
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
          <th style={styleWidth10}> </th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          data.map((row: ObjectData & { expanded: boolean }, i: number) => {
            const rows = [
              <tr
                key={['objectRow', i].join('_')}
                onClick={() => enableResultForObject && handleClickRow(row)}
                className={row.expanded ? 'expanded-row' : 'collapsed-row'}
              >
                <td /*name="type"*/ style={styleWidth10}>
                  <span className="icon icon-musitobject" />
                </td>
                <td /*name="museumNo"*/>{row.museumNo}</td>
                <td /*name="subNo"*/>{row.subNo}</td>
                <td /* name="term" */>{row.term}</td>
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
                    <ViewOjectData objectData={row} />
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
