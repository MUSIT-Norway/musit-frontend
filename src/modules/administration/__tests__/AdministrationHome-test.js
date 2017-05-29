// @flow
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { Administration } from '../Administration';
import { appSession } from './../../../testutils/sampleDataForTest';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('Administration', () => {
  it('should render Administration', () => {
    const wrapper = shallow(<Administration appSession={appSession} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
