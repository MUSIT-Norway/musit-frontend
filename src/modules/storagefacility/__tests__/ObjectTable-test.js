import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import ObjectGrid from '../ObjectTable';
import { expect as e } from 'chai';



describe ('ObjectTable' ,() => {



  const tableData = [
    { id: 1 , museumNo: 'TRH-V-1-2', subNo: '2', term: 'Carex'},
    { id: 2 , museumNo: 'TRH-V-2', subNo: '2', term: 'Pinus sylvestris'},
    { id: 3 , museumNo: 'UEM3', term: 'Steinøks'},
    { id: 4 , museumNo: 'BG233', subNo: '233', term: 'Flintavslag'},
    { id: 5 , museumNo: 'O-L-233', term: 'Cladionia'}
  ];


  const pickObject = sinon.spy();
  const showMoveHistory = sinon.spy();
  const onMove = sinon.spy();
  const dummyArg = { preventDefault: () => null };
  const wrapper = shallow(
    <ObjectGrid
      tableData={ tableData }
      pickObject={pickObject}
      onMove={onMove}
      showMoveHistory={showMoveHistory}
      onLagreClick={(k) => k }
      loaded={ true }
      updateState={(k) => k }
    />
  );


  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });


  it('check count', () => {
    wrapper.find('tr').forEach( (node, index) => {
      if (index) {
        e(node.childAt(1).text().trim()).to.equal(tableData[index-1].museumNo);
        e(node.childAt(2).text().trim()).to.equal(tableData[index-1].subNo ? tableData[index-1].subNo:'');
        e(node.childAt(3).text().trim()).to.equal(tableData[index-1].term);
      }
    });
  });

  it('check count', () => {
    e(wrapper.find('tr')).to.have.length((tableData.length+1));
  });

  it('check pickObject', () => {
    wrapper.find('.onPickObject').first().simulate('click',dummyArg);
    e(pickObject.calledOnce).to.equal(true);
  });

  it('check pickObjects', () => {
    wrapper.find('.onPickObjects').first().simulate('click',dummyArg);
    e(pickObject.callCount).to.equal(tableData.length+1);
  });

  it('check click onMove', () => {
    wrapper.find('.onMoveClick').first().simulate('click',dummyArg);
    e(onMove.calledOnce).to.equal(true);
  });

  it('check click onShowMoveHistory', () => {
    wrapper.find('.onShowMoveHistory').first().simulate('click',dummyArg);
    e(showMoveHistory.calledOnce).to.equal(true);
  });

});

