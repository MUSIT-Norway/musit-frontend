import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import AnalysisAddComponent from '../AnalysisTypesComponent';

const analysisTypes = [
  {
    category: 8,
    id: '1bbf15cb-8348-4e66-99a4-bc314da57a42',
    name: '3D-skanning, laser',
    collections: [
      '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
      '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
      'ba3d4d30-810b-4c07-81b3-37751f2196f0',
      '88b35138-24b5-4e62-bae4-de80fae7df82',
      '7352794d-4973-447b-b84e-2635cafe910a',
      'fcb4c598-8b05-4095-ac00-ce66247be38a',
      'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
      'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
      '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
      '23ca0166-5f9e-44c2-ab0d-b4cdd704af07'
    ]
  },
  {
    category: 8,
    id: 'b39399ab-aabd-4ebc-903b-adcf6876a364',
    name: '3D-skanning, strukturert lys',
    collections: [
      '1d8dd4e6-1527-439c-ac86-fc315e0ce852',
      '2e4f2455-1b3b-4a04-80a1-ba92715ff613',
      'ba3d4d30-810b-4c07-81b3-37751f2196f0',
      '88b35138-24b5-4e62-bae4-de80fae7df82',
      '7352794d-4973-447b-b84e-2635cafe910a',
      'fcb4c598-8b05-4095-ac00-ce66247be38a',
      'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4',
      'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24',
      '8bbdf9b3-56d1-479a-9509-2ea82842e8f8',
      '23ca0166-5f9e-44c2-ab0d-b4cdd704af07'
    ]
  }
];

const store = {
  analysisTypes: analysisTypes
};

describe('AnalysisTypesComponent', () => {
  it('should render properly', () => {
    const wrapper = shallow(<AnalysisAddComponent store={store} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
