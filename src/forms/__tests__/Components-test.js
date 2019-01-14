// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import { FormInputSelect } from '../components';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('FormInputSelect', () => {
  const props = {
    id: 'selectInput',
    values: [{ id: 0, value: 'Grønn' }, { id: 1, value: 'Rød' }, { id: 2, value: 'Gul' }],
    value: 'Hvit',
    label: 'Farger',
    labelWidth: 1,
    elementWidth: 3,
    chooseLabel: 'Velg farge'
  };

  it('should not be null', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(<FormInputSelect {...props} onChange={onChange} />);
    expect(wrapper).not.toBe(null);
  });

  it('should not have correct number of options', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(<FormInputSelect {...props} onChange={onChange} />);
    expect(wrapper.find('option').length).toBe(3);
  });

  it('should contain expected data', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(<FormInputSelect {...props} onChange={onChange} />);
    expect(wrapper.find('datalist').html()).toContain('Rød');
    expect(wrapper.find('input').html()).toContain('Hvit');
  });
});
