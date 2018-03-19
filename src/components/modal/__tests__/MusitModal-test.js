import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import Modal from '../MusitModal';

describe('MusitModal', () => {
  it('should render header, body and footer', () => {
    const wrapper = shallow(
      <Modal
        header={<span>A header</span>}
        footer={<span>A footer</span>}
        body={<div>Some really cool body</div>}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
