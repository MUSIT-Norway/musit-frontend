import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ModalNodeGrid from '../MoveDialogGrid';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('ModalNodeGrid', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <ModalNodeGrid
        onClick={key => key}
        tableData={[
          {
            name: 'Eske',
            type: 'StorageUnit'
          },
          {
            name: 'Box',
            type: 'StorageUnit'
          },
          {
            name: 'Room',
            type: 'Room'
          }
        ]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
