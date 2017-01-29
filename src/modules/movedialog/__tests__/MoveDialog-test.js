import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ModalNodeGrid from '../ModalNodeGrid';

describe('ModalNodeGrid', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <ModalNodeGrid
        onClick={(key) => key}
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
