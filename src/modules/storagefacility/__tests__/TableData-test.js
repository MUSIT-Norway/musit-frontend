import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import TableData from '../TableData';
import { expect as e } from 'chai';

describe('TableData', () => {
  const pickObject = sinon.spy();
  const showMoveHistory = sinon.spy();
  const onMove = sinon.spy();
  const dummyArg = { preventDefault: () => null, stopPropagation: () => null };
  const rowData = { id: 1, museumNo: 'TRH-V-1-2', subNo: '2', term: 'Carex' };
  const wrapper = shallow(
    <TableData
      appSession={{}}
      goToObject={() => {}}
      rowData={rowData}
      pickObject={pickObject}
      onMove={onMove}
      showMoveHistory={showMoveHistory}
      isObjectAdded={() => false}
      sampleStore={{}}
    />
  );

  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('check pickObject', () => {
    wrapper.find('.onPickObject').first().simulate('click', dummyArg);
    e(pickObject.calledOnce).to.equal(true);
  });

  it('check pickObjects', () => {
    wrapper.find('.onPickObjects').first().simulate('click', dummyArg);
    e(pickObject.calledOnce).to.equal(true);
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
