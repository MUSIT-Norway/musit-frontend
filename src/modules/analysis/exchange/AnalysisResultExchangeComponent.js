// @flow
import React from 'react';
import { I18n } from 'react-i18nify';

import Export from '../../../components/spreadsheet/ExportSpreadsheetComponent';
import Import from '../../../components/spreadsheet/ImportSpreadsheetComponent';
import ImportVerificationTable from './ImportVerificationTableComponent';

import type { StoreState } from './analysisExchangeStore';
type ImportResult = (resultRows: Array<any>) => void;

type Props = {
  analysisExchangeStore: StoreState,
  importResult: ImportResult,
  uploadResult: () => void,
  cancelImport: () => void
};

const hasImportedResults = (props: Props) =>
  props.analysisExchangeStore.importResult.rows.length > 0;

const AnalysisResultExchangeComponent = (props: Props) => (
  <div className="container">
    <div className="page-header">
      <h1>
        {I18n.t('musit.analysis.exchange.pageHeader')}
      </h1>
    </div>

    <Export
      displayName={I18n.t('musit.analysis.exchange.downloadTemplate')}
      fileName="result-import"
      content={props.analysisExchangeStore.exportTemplate}
      styles={[]}
    />
    <hr />
    <div className="row">
      <div className="col-md-12 col-sm-12">
        {I18n.t('musit.analysis.exchange.description')}
        <Import
          header={props.analysisExchangeStore.importHeaders}
          loadContent={props.importResult}
        />
      </div>

    </div>

    <ImportVerificationTable
      result={props.analysisExchangeStore.importResult.rows}
      resultHeaders={props.analysisExchangeStore.resultHeaders}
    />

    <hr />
    <div className="row">
      <div className="col-md-6 col-sm-6">
        <button
          className={'submitButton btn btn-primary center-block '}
          id="importResults"
          disabled={hasImportedResults(props) ? '' : 'disabled'}
          onClick={props.uploadResult}
        >
          {I18n.t('musit.analysis.exchange.importButton')}
        </button>
      </div>
      <div className="col-md-6 col-sm-6">
        <button
          className="cancelButton btn btn-link center-block"
          id="cancelImportResults"
          onClick={props.cancelImport}
        >
          {I18n.t('musit.analysis.exchange.cancelImportButton')}
        </button>
      </div>
    </div>

    <div className="row">
      {props.analysisExchangeStore.importErrors.map((error: string, index: number) => (
        <div key={index} className="col-md-12">{error}</div>
      ))}

    </div>

  </div>
);

export default AnalysisResultExchangeComponent;
