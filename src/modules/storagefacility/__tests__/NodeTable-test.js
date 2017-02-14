import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import NodeGrid from '../NodeTable';
import { expect as e } from 'chai';



describe ('NodeTable' ,() => {

  const tableData = [
    { name: 'NHM', type: 'Organisation', isRootNode: () => true },
    { name: 'KHM', type: 'Organisation', isRootNode: () => true },
    { name: 'Bygg 1', type: 'Building', isRootNode: () => false },
    { name: 'Bygg 2', type: 'Building' , isRootNode: () => false },
    { name: 'Rom 1', type: 'Room' , isRootNode: () => false }
  ];



  const onClick = sinon.spy();
  const pickNode = sinon.spy();
  const onMove = sinon.spy();
  const goToEvents = sinon.spy();
  const wrapper = shallow(
    <NodeGrid
      tableData={ tableData }
      goToEvents={goToEvents}
      pickNode={pickNode}
      onMove={onMove}
      onClick={onClick}
      onLagreClick={(k) => k }
      loaded={ true }
      updateState={(k) => k }
    />
  );


  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });


  it('check content', () => {
    wrapper.find('tr').forEach( (node, index) => {
      if (index) {
        const name = tableData[index-1].name;
        e(node.find('td').first().last().text()).to.contain(name);
      }
    });
  });

  it('check count', () => {
    e(wrapper.find('tr')).to.have.length((tableData.length+1));
  });


  it('check clickNameClick', () => {
    wrapper.find('.onClickName').first().simulate('click');
    e(onClick.calledOnce).to.be.true;
  });


  it('check click onMove', () => {
    wrapper.find('.onMoveClick').first().simulate('click');
    e(onMove.calledOnce).to.be.true;
  });

  it('check click goToEventClick', () => {
    wrapper.find('.goToEventClick').first().simulate('click');
    e(goToEvents.calledOnce).to.be.true;
  });

  it('check click onPickClick', () => {
    wrapper.find('.onPickClick').first().simulate('click');
    e(pickNode.calledOnce).to.be.true;
  });
});
