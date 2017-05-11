// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { Administration } from '../Administration';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('Administration', () => {
  const appSession = {
    museumId: 99,
    collectionId: '45555',
    accessToken: '1234',
    actor: {
      fn: 'test'
    }
  };
  it('should render Administration', () => {
    const wrapper = shallow(<Administration appSession={appSession} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
