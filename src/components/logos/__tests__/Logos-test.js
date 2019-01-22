import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import NotFound from '../Logos';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Logos', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<NotFound />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
