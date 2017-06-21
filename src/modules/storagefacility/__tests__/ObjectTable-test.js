import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import ObjectGrid from '../ObjectTable';
import { expect as e } from 'chai';

describe('ObjectTable', () => {
  const tableData = [
    { id: 1, museumNo: 'TRH-V-1-2', subNo: '2', term: 'Carex' },
    { id: 2, museumNo: 'TRH-V-2', subNo: '2', term: 'Pinus sylvestris' },
    { id: 3, museumNo: 'UEM3', term: 'Steinøks' },
    { id: 4, museumNo: 'BG233', subNo: '233', term: 'Flintavslag' },
    { id: 5, museumNo: 'O-L-233', term: 'Cladionia' }
  ];
  const sampleStore = [
    {
      museumNo: 'MusN11',
      term: 'Solsikke',
      museumNo: 'MusN11',
      sampleObject: { objectId: 'f3eb093c-528d-460f-a94f-9971ba5f2656' },
      description: 'cvxcvcx',
      isDeleted: false,
      isExtracted: true,
      leftoverSample: 1,
      museumId: 99,
      note: 'cvcxv',
      objectId: 'f3eb093c-528d-460f-a94f-9971ba5f2656',
      originatedObjectUuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      parentObject: {
        objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        objectType: 'collection'
      },
      objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      objectType: 'collection',
      registeredStamp: {
        user: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        date: '2017-06-20T10:34:56+00:00'
      },
      date: '2017-06-20T10:34:56+00:00',
      user: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      sampleNum: 4,
      sampleTypeId: 12,
      status: 4,
      storageMedium: 'dsH20',
      treatment: 'Qiagen plant kit',
      updatedStamp: {
        user: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
        date: '2017-06-20T10:57:52+00:00'
      },
      date: '2017-06-20T10:57:52+00:00',
      user: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
      term: 'Solsikke'
    }
  ];
  const pickObject = sinon.spy();
  const showMoveHistory = sinon.spy();
  const onMove = sinon.spy();
  const dummyArg = { preventDefault: () => null, stopPropagation: () => null };
  const wrapper = shallow(
    <ObjectGrid
      goToObject={() => {}}
      tableData={tableData}
      pickObject={pickObject}
      onMove={onMove}
      showMoveHistory={showMoveHistory}
      onLagreClick={k => k}
      loaded={true}
      updateState={k => k}
      isObjectAdded={k => k}
      sampleStore={sampleStore}
    />
  );

  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('check count', () => {
    wrapper.find('tr').forEach((node, index) => {
      if (index) {
        e(node.childAt(1).text().trim()).to.equal(tableData[index - 1].museumNo);
        e(node.childAt(2).text().trim()).to.equal(
          tableData[index - 1].subNo ? tableData[index - 1].subNo : ''
        );
        e(node.childAt(3).text().trim()).to.equal(tableData[index - 1].term);
      }
    });
  });

  it('check count', () => {
    e(wrapper.find('tr')).to.have.length(tableData.length + 1);
  });

  it('check pickObject', () => {
    wrapper.find('.onPickObject').first().simulate('click', dummyArg);
    e(pickObject.calledOnce).to.equal(true);
  });

  it('check pickObjects', () => {
    wrapper.find('.onPickObjects').first().simulate('click', dummyArg);
    e(pickObject.callCount).to.equal(tableData.length + 1);
  });

  it('check click onMove', () => {
    wrapper.find('.onMoveClick').first().simulate('click', dummyArg);
    e(onMove.calledOnce).to.equal(true);
  });

  it('check click onShowMoveHistory', () => {
    wrapper.find('.onShowMoveHistory').first().simulate('click', dummyArg);
    e(showMoveHistory.calledOnce).to.equal(true);
  });
});
