// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import './ObjectResultTable.css';
import ViewResult from './ViewResult';
import EditResult from './EditResult';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import type { AnalysisEvent } from '../../../types/analysis';
import FontAwesome from 'react-fontawesome';
import MusitI18n from '../../../components/MusitI18n';

type Props = {
  data: Array<AnalysisEvent>,
  handleClickRow: (object: AnalysisEvent) => void,
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
  const enableResultForObject = data.length > 1;
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
          <th>{I18n.t('musit.sample.sampleNumber')}</th>
          <th>{I18n.t('musit.sample.sampleType')}</th>
          <th width={10}> </th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          data.map((row, i) => {
            const sampleData = row.sampleData;
            const rows = [
              <tr
                key={['objectRow', i].join('_')}
                onClick={() => enableResultForObject && handleClickRow(row)}
                className={row.expanded ? 'expanded-row' : 'collapsed-row'}
              >
                <td name="type" width={10}>
                  {sampleData && sampleData.sampleNum ? (
                    <span className="icon icon-musit-testtube" />
                  ) : (
                    <span className="icon icon-musitobject" />
                  )}
                </td>
                <td name="museumNo">
                  {row.objectData ? row.objectData.museumNo || '' : ''}
                </td>
                <td name="subNo">{row.objectData ? row.objectData.subNo || '' : ''}</td>
                <td name="term">{row.objectData ? row.objectData.term || '' : ''}</td>
                <td name="sampleNum">
                  <span>{sampleData ? sampleData.sampleNum || '' : null}</span>
                </td>
                <td name="sampleType">
                  {!!(
                    sampleData &&
                    sampleData.sampleType &&
                    sampleData.sampleType.enSampleType
                  ) && (
                    <MusitI18n
                      en={sampleData.sampleType.enSampleType}
                      no={sampleData.sampleType.noSampleType}
                    />
                  )}
                  {!!(
                    sampleData &&
                    sampleData.sampleType &&
                    sampleData.sampleType.enSampleSubType
                  ) && (
                    <span>
                      <span>{' / '}</span>
                      <MusitI18n
                        en={sampleData.sampleType.enSampleSubType}
                        no={sampleData.sampleType.noSampleSubType}
                      />
                    </span>
                  )}
                </td>
                <td>
                  {enableResultForObject &&
                    (row.expanded ? (
                      <FontAwesome name="chevron-up" />
                    ) : (
                      <FontAwesome name="chevron-right" />
                    ))}
                </td>
              </tr>
            ];
            if (row.expanded) {
              return [
                ...rows,
                <tr key={['objectResult', i].join('_')} className="expanded-row-dropdown">
                  <td colSpan={7}>
                    {viewMode ? (
                      <ViewResult
                        extraAttributes={extraAttributesWithResult(
                          extraAttributes,
                          row.result
                        )}
                        externalSource={
                          row.result && row.result.extRef ? (
                            row.result.extRef.join(',')
                          ) : (
                            ''
                          )
                        }
                        comments={row.result ? row.result.comment : ''}
                        files={
                          row.files && Array.isArray(row.files) ? (
                            (row.files: Array<any>)
                          ) : (
                            []
                          )
                        }
                        appSession={appSession}
                        history={history}
                        parentObjectId={
                          sampleData && sampleData.originatedObjectUuid ? (
                            sampleData.originatedObjectUuid
                          ) : row.objectData ? (
                            row.objectData.uuid
                          ) : null
                        }
                      />
                    ) : (
                      <EditResult
                        extraAttributes={extraAttributesWithResult(
                          extraAttributes,
                          row.result
                        )}
                        updateExtraResultAttribute={(name, value) => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, [name]: value }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        externalSource={
                          row.result && row.result.extRef ? (
                            row.result.extRef.join(',')
                          ) : (
                            ''
                          )
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
                        comments={row.result ? row.result.comment : ''}
                        updateComments={comment => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, comment }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        resultFiles={
                          row.result && row.result.files ? (row.result.files: any) : []
                        }
                        updateResultFiles={files => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, files }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        appSession={appSession}
                        history={history}
                        parentObjectId={
                          sampleData && sampleData.originatedObjectUuid ? (
                            sampleData.originatedObjectUuid
                          ) : row.objectData ? (
                            row.objectData.uuid
                          ) : null
                        }
                      />
                    )}
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

function extraAttributesWithResult(extraAttributes, result) {
  return (
    !!extraAttributes &&
    Object.keys(extraAttributes).reduce((acc, eat) => {
      const value = result && result[eat];
      const eatAttr: any =
        extraAttributes && extraAttributes[eat] ? extraAttributes[eat] : {};
      return {
        ...acc,
        [eat]: {
          ...eatAttr,
          value:
            eatAttr.type === 'String' &&
            (typeof value === 'string' || typeof value === 'undefined' || value === null)
              ? value
              : typeof value !== 'string' && { ...value, rawValue: getRawValue(value) }
        }
      };
    }, {})
  );
}
