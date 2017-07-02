// @flow

import NavigateToObject from '../NavigateToObject';
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { appSession } from '../../../testutils/sampleDataForTest';
import sinon from 'sinon';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('NavigateToObject', () => {
  it('should render component', () => {
    const history = sinon.spy();
    const wrapper = shallow(
      <NavigateToObject
        objectId="12080e3e-2ca2-41b1-9d4a-4d72e292dcd8"
        appSession={appSession}
        history={history}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(history.calledOnce).toBe(false);
  });
});
