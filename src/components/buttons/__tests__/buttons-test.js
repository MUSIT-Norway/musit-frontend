import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import Cancel from '../cancel';
import Submit from '../submit';

describe('Cancel', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Cancel label="Cancel button" />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});

describe('Submit', () => {
  it('should match snapshot when enabled', () => {
    const wrapper = shallow(<Submit label="Submit button" disabled={false} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when disabled', () => {
    const wrapper = shallow(<Submit label="Submit button" disabled={true} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
