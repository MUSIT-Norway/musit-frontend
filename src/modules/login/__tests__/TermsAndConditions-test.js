import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { TermsAndConditions } from '../TermsAndConditions';
import TermsAndConditionsEn from '../TermsAndConditions_en.html';
import TermsAndConditionsNo from '../TermsAndConditions_no.html';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TermsAndConditions', () => {
  it('should render norwegian text', () => {
    const wrapper = shallow(<TermsAndConditions locale={() => 'no'} />);
    expect(wrapper.find(TermsAndConditionsNo).length).toBe(1);
    expect(wrapper.find(TermsAndConditionsEn).length).toBe(0);
  });
  it('should render english text', () => {
    const wrapper = shallow(<TermsAndConditions locale={() => 'en'} />);
    expect(wrapper.find(TermsAndConditionsEn).length).toBe(1);
    expect(wrapper.find(TermsAndConditionsNo).length).toBe(0);
  });

  it('should have norwegian text', () => {
    const wrapper = shallow(<TermsAndConditionsNo />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should have english text', () => {
    const wrapper = shallow(<TermsAndConditionsEn />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
