import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { LoginComponent } from '../LoginComponent';
import LoginComponentEn from '../LoginComponent_en.html';
import LoginComponentNo from '../LoginComponent_no.html';
import LoginButton from '../LoginButton';
import sinon from 'sinon';

describe('LoginPage', () => {
  it('should render norwegian text', () => {
    const wrapper = shallow(
      <LoginComponent
        locale={() => 'no'}
      />
    );
    wrapper.setState({ showModal: true });
    expect(wrapper.find(LoginComponentNo).length).toBe(1);
    expect(wrapper.find(LoginComponentEn).length).toBe(0);
  });

  it('should render english text', () => {
    const wrapper = shallow(
      <LoginComponent
        locale={() => 'en'}
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

  it('should have a working login button', () => {
    const navigate = sinon.spy();
    const wrapper = shallow(
      <LoginButton navigate={navigate}><span>Click Me</span></LoginButton>
    );
    wrapper.find('.loginButton').simulate('click');
    expect(navigate.calledOnce).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
