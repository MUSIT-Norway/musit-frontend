import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { Administration } from '../Administration';

describe('Administration', () => {
  const appSession = {
    museumId: 99,
    collectionId: '45555',
    accessToken: '1234'
  };
  it('should render Administration', () => {
    const wrapper = shallow(<Administration appSession={appSession} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
