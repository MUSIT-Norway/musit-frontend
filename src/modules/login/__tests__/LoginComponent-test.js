import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { LoginComponent } from '../LoginComponent';
import LoginComponentEn from '../LoginComponent_en.html';
import LoginComponentNo from '../LoginComponent_no.html';

describe('AboutPage', () => {
  it('should render norwegian text', () => {
    const wrapper = shallow(
      <LoginComponent
        getLocale={() => 'no'}
      />
    );
    wrapper.setState({ showModal: true });
    expect(wrapper.find(LoginComponentNo).length).toBe(1);
    expect(wrapper.find(LoginComponentEn).length).toBe(0);
  });

  it('should render english text', () => {
    const wrapper = shallow(
      <LoginComponent
        getLocale={() => 'en'}
      />
    );
    expect(wrapper.find(LoginComponentEn).length).toBe(1);
    expect(wrapper.find(LoginComponentNo).length).toBe(0);
  });

  it('should have norwegian text', () => {
    const wrapper = shallow(
      <LoginComponentNo />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should have english text', () => {
    const wrapper = shallow(
      <LoginComponentEn />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
