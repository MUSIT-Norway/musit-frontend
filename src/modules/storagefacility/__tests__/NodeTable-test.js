import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import NodeGrid from '../NodeTable';
import { expect as e } from 'chai';



describe ('NodeTable' ,() => {

  const tableData =   [
    {name: 'Carex', type: 'Blomst', isRootNode: () => true },
    {name: 'Steinøks', type: 'Verktøy', isRootNode: () => false},
    {name: 'Blåveis', type: 'Blomst', isRootNode: () => false},
    {name: 'Neshorn', type: 'Dyr' , isRootNode: () => true},
    {name: 'Blåklokke', type: 'Blomstu' , isRootNode: () => true}];
  const wrapper = shallow(
    <NodeGrid
      tableData={tableData}
      goToEvents={(x) => x}
      pickNode={(x) => x}
      onMove={(x) => x}
      onClick={(x) => x}
      onLagreClick={(k) => k}
      loaded={true}
      updateState={(k) => k}/>
  );


  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });


  it('check content', () => {
    e(wrapper.find('tr')).to.have.length((tableData.length+1))
  });
});
