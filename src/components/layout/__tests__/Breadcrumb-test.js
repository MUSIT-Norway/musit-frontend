import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import Breadcrumb from '../Breadcrumb';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('StorageUnitsContainer_Breadcrumb_test', () => {
  it('Breadcrumb first element should have name "Museum": ', () => {
    const nodes = [
      { id: 1, name: 'Museum', type: 'Building', url: '/test/1' },
      { id: 2, name: 'Bygg1', type: 'Building', url: '/test/2' },
      { id: 3, name: 'Pauserom', type: 'Room', url: '/test/2' }
    ];
    const wrapper = shallow(
      <Breadcrumb
        allActive={false}
        nodes={nodes}
        onClickCrumb={(nn, i) => `Node: ${nn} ${i}`}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
