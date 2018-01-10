// @flow
import React from 'react';
import Toolbar from '../Toolbar';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

describe('Test Toolbar', () => {
  const toolbar = shallow(<Toolbar />);
  it('Test Toobbar is created', () => {
    expect(shallowToJson(toolbar)).toMatchSnapshot();
  });
});
