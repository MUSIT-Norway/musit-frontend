// @flow
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ImportVerificationTableComponent from '../ImportVerificationTableComponent';
import AnalysisResultExchangeComponent from '../AnalysisResultExchangeComponent';
import Export from '../../../../components/spreadsheet/ExportSpreadsheetComponent';
import Import from '../../../../components/spreadsheet/ImportSpreadsheetComponent';

import type { StoreState } from '../analysisExchangeStore';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('AnalysisResultExchangeComponent', () => {
  const emptyStore = (): StoreState => ({
    exportTemplate: [],
    importHeaders: [],
    resultHeaders: [],
    importResult: {
      rows: []
    },
    importErrors: [],
    analysisTypes: [],
    analysisResultType: null
  });

  it('should include all components', () => {
    const importResultAction = sinon.spy();
    const cancelAction = sinon.spy();
    const uploadResultAction = sinon.spy();
    const Comp = shallow(
      <AnalysisResultExchangeComponent
        analysisExchangeStore={emptyStore()}
        importResult={importResultAction}
        cancelImport={cancelAction}
        uploadResult={uploadResultAction}
      />
    );

    expect(Comp.find(ImportVerificationTableComponent).length).toBe(1);
    expect(Comp.find(Import)).toHaveLength(1);
    expect(Comp.find(Export)).toHaveLength(1);
  });

  it('should render import button as disabled', () => {
    const importResultAction = sinon.spy();
    const cancelAction = sinon.spy();
    const uploadResultAction = sinon.spy();
    const store = emptyStore();
    const Comp = shallow(
      <AnalysisResultExchangeComponent
        analysisExchangeStore={store}
        importResult={importResultAction}
        cancelImport={cancelAction}
        uploadResult={uploadResultAction}
      />
    );

    expect(Comp.find('#importResults').props()['disabled']).toEqual(true);
  });

  it('should trigger event when import button is clicked', () => {
    const importResultAction = sinon.spy();
    const cancelAction = sinon.spy();
    const uploadResultAction = sinon.spy();
    const store = emptyStore();
    store.importResult.rows.push({
      analysisId: 1,
      type: 'sample',
      objectId: null,
      affectedThing: null,
      museumNo: null,
      subNo: null,
      arkFindingNo: null,
      term: null,
      sampleObjectId: null,
      sampleNum: null,
      sampleId: null,
      sampleType: null,
      resultExternalRef: null,
      resultComment: null
    });
    const Comp = shallow(
      <AnalysisResultExchangeComponent
        analysisExchangeStore={store}
        importResult={importResultAction}
        cancelImport={cancelAction}
        uploadResult={uploadResultAction}
      />
    );

    Comp.find('#importResults')
      .first()
      .simulate('click');

    expect(Comp.find('#importResults').props()['disabled']).toEqual(false);
    expect(uploadResultAction.calledOnce).toBe(true);
  });

  it('should trigger event when cancel button is clicked', () => {
    const importResultAction = sinon.spy();
    const cancelAction = sinon.spy();
    const uploadResultAction = sinon.spy();
    const store = emptyStore();
    const Comp = shallow(
      <AnalysisResultExchangeComponent
        analysisExchangeStore={store}
        importResult={importResultAction}
        cancelImport={cancelAction}
        uploadResult={uploadResultAction}
      />
    );

    Comp.find('#cancelImportResults')
      .first()
      .simulate('click');

    expect(cancelAction.calledOnce).toBe(true);
  });
});
