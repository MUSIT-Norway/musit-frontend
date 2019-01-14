// @flow
import React from 'react';
import Toolbar from '../Toolbar';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Test Toolbar', () => {
  const toolbar = shallow(<Toolbar />);
  it('Test Toobbar is created', () => {
    expect(shallowToJson(toolbar)).toMatchSnapshot();
  });
});
