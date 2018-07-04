// @flow
import React from 'react';
import { I18n } from 'react-i18nify';

import type { ResultExchangeTemplates } from './exchangeTemplate';
type Props = {
  result: Array<ResultExchangeTemplates>,
  resultHeaders: Array<string>
};

const ImportVerificationTableComponent = (props: Props) => (
  <div className="table-responsive">
    {props.result.length > 0 && (
      <table className="table table-condensed table-hover">
        <thead>
          <tr>
            <th>{I18n.t('musit.analysis.exchange.header.type')}</th>
            <th>{I18n.t('musit.analysis.exchange.header.analysisId')}</th>
            <th>{I18n.t('musit.analysis.exchange.header.objectId')}</th>

            {props.resultHeaders.map(h => (
              <th key={h}>{I18n.t('musit.analysis.exchange.header.' + h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.result.map(row => (
            <tr key={row.analysisId}>
              <td>{row.type}</td>
              <td>{row.analysisId}</td>
              <td>{row.sampleObjectId || row.objectId}</td>

              {props.resultHeaders.map(h => <td key={h}>{row[h]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ImportVerificationTableComponent;
