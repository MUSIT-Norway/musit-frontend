// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { Administration } from '../Administration';
import { appSession } from '../../../testutils/sampleDataForTest';
import type { History } from 'types/Routes';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const history: History = {
  push: (path, state) => {},
  replace: (path, state) => {},
  goBack: () => {},
  goForward: () => {}
};

describe('Administration', () => {
  it('should render Administration', () => {
    const wrapper = shallow(<Administration appSession={appSession} history={history} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
